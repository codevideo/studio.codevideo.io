import { useEffect } from "react";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useDesktopProject } from "../../hooks/useDesktopProject";

const isMac =
  typeof navigator !== "undefined" && /Mac/.test(navigator.platform);
const shortcut = (key: string) => (isMac ? `⌘${key}` : `Ctrl+${key}`);

/** New, Open and Save for project files, in place of the web studio's project sidebar. */
export function DesktopProjectMenu() {
  const { newProject, open, save } = useDesktopProject();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(isMac ? event.metaKey : event.ctrlKey) || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "s") save(event.shiftKey);
      else if (key === "o" && !event.shiftKey) open();
      else if (key === "n" && !event.shiftKey) newProject();
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" aria-label="Project">
          <HamburgerMenuIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item shortcut={shortcut("N")} onSelect={newProject}>
          New lesson
        </DropdownMenu.Item>
        <DropdownMenu.Item shortcut={shortcut("O")} onSelect={open}>
          Open…
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut={shortcut("S")} onSelect={() => save()}>
          Save
        </DropdownMenu.Item>
        <DropdownMenu.Item
          shortcut={isMac ? "⇧⌘S" : "Ctrl+Shift+S"}
          onSelect={() => save(true)}
        >
          Save as…
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
