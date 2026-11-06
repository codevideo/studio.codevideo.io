import { afterEach, it, expect, vi } from "vitest";
import { textToSpeech } from "./textToSpeech";
afterEach(() => vi.unstubAllGlobals());
it("sends auth and the BYO key only in the request body", async () => {
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      mp3Url: "https://example.com/t.mp3",
      assetId: "a",
      provider: "elevenlabs",
      voiceId: "testvoice123",
      speed: 1,
      elevenLabsApiKey: "must-not-return",
    }),
  });
  vi.stubGlobal("fetch", fetch);
  const result = await textToSpeech(
    {
      text: "Hello",
      provider: "elevenlabs",
      voiceId: "testvoice123",
      speed: 1,
      elevenLabsApiKey: "secret",
    },
    "token",
  );
  expect(fetch.mock.calls[0]?.[1].headers.Authorization).toBe("Bearer token");
  expect(JSON.parse(fetch.mock.calls[0]?.[1].body).elevenLabsApiKey).toBe(
    "secret",
  );
  expect(result).not.toHaveProperty("elevenLabsApiKey");
});
it("explains when the endpoint is not deployed", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
  await expect(
    textToSpeech(
      { text: "Hello", provider: "kokoro", voiceId: "af_heart", speed: 1 },
      "token",
    ),
  ).rejects.toThrow("not available");
});
it("rejects an invalid API take", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mp3Url: "javascript:bad" }),
    }),
  );
  await expect(
    textToSpeech(
      { text: "Hello", provider: "kokoro", voiceId: "af_heart", speed: 1 },
      "token",
    ),
  ).rejects.toThrow("invalid take");
});

it("redacts a BYO key even if an API error accidentally includes it", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Rejected secret-key" }),
      }),
  );
  await expect(
    textToSpeech(
      {
        text: "Hello",
        provider: "elevenlabs",
        voiceId: "testvoice123",
        speed: 1,
        elevenLabsApiKey: "secret-key",
      },
      "token",
    ),
  ).rejects.toThrow("Rejected [redacted]");
});
