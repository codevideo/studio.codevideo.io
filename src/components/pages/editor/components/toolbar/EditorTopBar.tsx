import { IconButton } from "@radix-ui/themes";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { toggleSidebar } from "../../../../../store/editorSlice";
import { LessonSelect } from "./LessonSelect";
import { EditorSettingsDialog } from "../settings/EditorSettingsDialog";
export function EditorTopBar() {
  const p = useAppSelector((s) => s.editor.currentProject?.project);
  const dispatch = useAppDispatch();
  return (
    <header className="cv-topbar">
      <IconButton
        variant="ghost"
        aria-label="Projects"
        onClick={() => dispatch(toggleSidebar())}
      >
        <HamburgerMenuIcon />
      </IconButton>
      <span className="cv-brand">
        CodeVideo <span>EDITOR</span>
      </span>
      <span className="cv-project-name">
        {p && !Array.isArray(p) ? p.name : "Untitled project"}
      </span>
      <LessonSelect />
      <div className="cv-topbar-spacer" />
      <EditorSettingsDialog />
    </header>
  );
}
