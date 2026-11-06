import { useEffect } from "react";
import { EditActions } from "./useEditActions";
import { Playback } from "./usePlayback";
export function useEditorShortcuts(
  playback: Playback,
  edits: EditActions,
  selectedIndex: number,
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement;
      if (
        event.defaultPrevented ||
        el.closest(
          'input,textarea,select,[contenteditable="true"],[data-editor-preview],[role="dialog"],[role="menu"],[role="combobox"]',
        )
      )
        return;
      const command = event.metaKey || event.ctrlKey;
      if (event.code === "Space") {
        event.preventDefault();
        playback.isPlaying ? playback.pause() : playback.play();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        playback.seek(playback.index + (event.key === "ArrowLeft" ? -1 : 1));
      } else if (command && event.key.toLowerCase() === "z") {
        event.preventDefault();
        event.shiftKey ? edits.redo() : edits.undo();
      } else if (
        command &&
        event.key.toLowerCase() === "d" &&
        selectedIndex >= 0
      ) {
        event.preventDefault();
        edits.duplicate(selectedIndex);
      } else if (
        (event.key === "Backspace" || event.key === "Delete") &&
        selectedIndex >= 0
      ) {
        event.preventDefault();
        edits.remove(selectedIndex);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
}
