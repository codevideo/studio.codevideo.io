import { IAction, IAudioItem } from "@fullstackcraftllc/codevideo-types";
import { SpeechLine } from "../../store/speechSlice";
export const activeTake = (text: string, takes: Record<string, SpeechLine>) =>
  takes[text]?.takes?.find((t) => t.assetId === takes[text]?.activeAssetId);
export function buildSpeakActionAudios(
  actions: IAction[],
  takes: Record<string, SpeechLine>,
): IAudioItem[] {
  return actions.flatMap((a, actionIndex) => {
    const t = a.name.startsWith("author-speak-")
      ? activeTake(a.value, takes)
      : undefined;
    return t
      ? [
          {
            text: a.value,
            mp3Url: t.mp3Url,
            assetId: t.assetId,
            durationMs: t.durationMs,
            actionIndex,
          },
        ]
      : [];
  });
}
export function speechMsByIndex(
  actions: IAction[],
  takes: Record<string, SpeechLine>,
): Record<number, number> {
  return Object.fromEntries(
    buildSpeakActionAudios(actions, takes).map((a) => [
      a.actionIndex,
      a.durationMs,
    ]),
  );
}
