import { PropsWithChildren } from "react";
import { ContextMenu } from "@radix-ui/themes";
import { EditActions } from "../../hooks/useEditActions";
import { Playback } from "../../hooks/usePlayback";
export function ActionTileMenu({
  children,
  index,
  edits,
  playback,
  insertAt,
}: {
  index: number;
  edits: EditActions;
  playback: Playback;
  insertAt: (index: number) => void;
} & PropsWithChildren) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div style={{ display: "contents" }}>{children}</div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onSelect={() => playback.play(index)}>
          Play from here
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘D" onSelect={() => edits.duplicate(index)}>
          Duplicate
        </ContextMenu.Item>
        <ContextMenu.Item
          shortcut="⌫"
          color="red"
          onSelect={() => edits.remove(index)}
        >
          Delete
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item onSelect={() => insertAt(index - 1)}>
          Insert before
        </ContextMenu.Item>
        <ContextMenu.Item onSelect={() => insertAt(index)}>
          Insert after
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
