import { ISpeechTake } from "../../store/speechSlice";
export interface TextToSpeechRequest {
  text: string;
  provider: "kokoro" | "elevenlabs";
  voiceId: string;
  speed: number;
  elevenLabsApiKey?: string;
}
export async function textToSpeech(
  request: TextToSpeechRequest,
  token: string,
): Promise<Omit<ISpeechTake, "durationMs" | "created">> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CODEVIDEO_API_URL}/texttospeech`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    },
  );
  if (response.status === 404)
    throw new Error(
      "Speech generation is not available on this API yet. Please try again after the API update.",
    );
  if (!response.ok) {
    let message = "Speech generation failed. Please try again.";
    try {
      const data = await response.json();
      if (typeof data.error === "string") message = data.error;
    } catch {}
    throw new Error(
      request.elevenLabsApiKey
        ? message.replaceAll(request.elevenLabsApiKey, "[redacted]")
        : message,
    );
  }
  const data = await response.json();
  if (
    typeof data.mp3Url !== "string" ||
    !/^https?:/.test(data.mp3Url) ||
    typeof data.assetId !== "string" ||
    !["kokoro", "elevenlabs"].includes(data.provider) ||
    typeof data.voiceId !== "string" ||
    !Number.isFinite(data.speed)
  )
    throw new Error("The speech API returned an invalid take.");
  return {
    mp3Url: data.mp3Url,
    assetId: data.assetId,
    provider: data.provider,
    voiceId: data.voiceId,
    speed: data.speed,
  };
}
export function measureAudioDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const timer = setTimeout(
      () => finish(new Error("Audio metadata timed out.")),
      20000,
    );
    function finish(error?: Error) {
      clearTimeout(timer);
      audio.onloadedmetadata = null;
      audio.onerror = null;
      const duration = audio.duration;
      audio.removeAttribute("src");
      audio.load();
      if (error) reject(error);
      else resolve(duration * 1000);
    }
    audio.preload = "metadata";
    audio.onloadedmetadata = () =>
      Number.isFinite(audio.duration) && audio.duration > 0
        ? finish()
        : finish(new Error("Could not measure this audio take."));
    audio.onerror = () =>
      finish(new Error("Could not load the generated audio."));
    audio.src = url;
  });
}
