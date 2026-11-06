import { IAction } from "@fullstackcraftllc/codevideo-types";
// Consume each reference once: repeated references still represent distinct clips.
export function reconcileActionIds(
  previous: IAction[],
  ids: string[],
  next: IAction[],
  createId: () => string = () => crypto.randomUUID(),
): string[] {
  const used = new Set<number>();
  const result = next.map((a) => {
    const i = previous.findIndex((p, j) => p === a && !used.has(j));
    if (i < 0) return undefined;
    used.add(i);
    return ids[i];
  });
  return result.map((id, i) => {
    if (id) return id;
    if (previous.length === next.length && !used.has(i) && ids[i]) {
      used.add(i);
      return ids[i]!;
    }
    return createId();
  });
}
