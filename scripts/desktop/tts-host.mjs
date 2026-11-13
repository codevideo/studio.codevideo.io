// Kokoro speech for the desktop app. prepare-runtime.mjs copies this file into
// the bundled codevideo-tts folder (runtime/tts/desktop-host.mjs), and the app
// runs it with the bundled Node. It uses codevideo-tts's own synthesis
// (src/synth.ts), so desktop and cloud speech come from the same code.
//
// One JSON request per line on stdin, one reply per line on stdout:
//   {"id": 1, "text": "Hello.", "voice": "af_heart", "speed": 1}
//   {"id": 1, "take": {"assetId": "…", "path": "/…/<assetId>.mp3", "voice": "af_heart", "speed": 1}}
//   {"id": 1, "error": "…"}
//
// The model loads from the bundled models folder. Nothing is downloaded: a
// missing model is an error, not a fetch from Hugging Face.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { env } from "@huggingface/transformers";
import { register } from "tsx/esm/api";

const here = path.dirname(fileURLToPath(import.meta.url));
env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = path.join(here, "models") + path.sep;

const cacheDir = process.env.CODEVIDEO_TTS_CACHE_DIR;
if (!cacheDir) {
  console.error("CODEVIDEO_TTS_CACHE_DIR is not set");
  process.exit(2);
}
mkdirSync(cacheDir, { recursive: true });

register();
const { synthesize, warm, MODEL_LABEL, DEFAULT_VOICE } = await import("./src/synth.ts");

const reply = (message) => process.stdout.write(JSON.stringify(message) + "\n");
// Load the model now, so the first take doesn't wait for it as long.
const warming = warm();
warming.catch((error) => console.error("Could not load the Kokoro model:", error));

async function speak({ id, text, voice, speed }) {
  try {
    if (typeof text !== "string" || !text.trim()) throw new Error("Speech needs some text.");
    voice = typeof voice === "string" && voice ? voice : DEFAULT_VOICE;
    speed = Number.isFinite(speed) ? Math.min(2, Math.max(0.5, speed)) : 1;
    // The key codevideo-tts's server caches its clips by.
    const assetId = createHash("sha256")
      .update(`${MODEL_LABEL}|${voice}|${speed}|mp3|${text}`)
      .digest("hex");
    const file = path.join(cacheDir, `${assetId}.mp3`);
    if (!existsSync(file)) {
      await warming;
      const { buffer, format } = await synthesize(text, { voice, speed, format: "mp3" });
      if (format !== "mp3") throw new Error("FFmpeg is missing, so speech can't be saved as MP3.");
      const partial = `${file}.${process.pid}.partial`;
      writeFileSync(partial, buffer);
      renameSync(partial, file);
    }
    reply({ id, take: { assetId, path: file, voice, speed } });
  } catch (error) {
    reply({ id, error: error instanceof Error ? error.message : String(error) });
  }
}

// One take at a time: Kokoro uses every core it gets.
let queue = Promise.resolve();
createInterface({ input: process.stdin }).on("line", (line) => {
  let request;
  try {
    request = JSON.parse(line);
  } catch {
    return;
  }
  queue = queue.then(() => speak(request));
});
// The app closed our stdin: finish what's queued, then stop. A normal exit
// makes onnxruntime's worker threads abort ("mutex lock failed"), so end
// without running exit handlers once every reply is written.
process.stdin.on("end", () =>
  queue.then(() => process.stdout.write("", () => process.kill(process.pid, "SIGKILL"))),
);
