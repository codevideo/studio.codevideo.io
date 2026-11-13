import { useStore } from "react-redux";
import {
  ICourse,
  ILesson,
  IAction,
  isCourse,
  isLesson,
  isValidActions,
  Project,
} from "@fullstackcraftllc/codevideo-types";
import { RootState } from "../../../../store";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import {
  addNewActionsToProjects,
  addNewCourseToProjects,
  addNewLessonToProjects,
} from "../../../../store/editorSlice";
import { addToast } from "../../../../store/toastSlice";
import { openProjectFile, saveProjectFile } from "../../../../runtime/desktop";

// Which file each project was opened from or saved to, keyed by the project's
// `created` time, so Save writes back to the same file.
const FILES_KEY = "CODEVIDEO_DESKTOP_PROJECT_FILES";

function projectFiles(): Record<string, string> {
  try {
    const files = JSON.parse(localStorage.getItem(FILES_KEY) ?? "{}");
    return files && typeof files === "object" ? files : {};
  } catch {
    return {};
  }
}

function rememberFile(created: string, path: string) {
  try {
    localStorage.setItem(
      FILES_KEY,
      JSON.stringify({ ...projectFiles(), [created]: path }),
    );
  } catch {}
}

export function projectName(project: Project | undefined) {
  return project && !Array.isArray(project) && project.name
    ? project.name
    : "Untitled project";
}

/** A file name without characters that file systems refuse. */
export function fileNameFor(project: Project | undefined, extension: string) {
  const name =
    projectName(project)
      .replace(/[\\/:*?"<>|]+/g, " ")
      .trim() || "CodeVideo";
  return `${name}.${extension}`;
}

/**
 * The desktop app's project files: the same JSON the CLI and the JSON export use,
 * an array of actions, a lesson or a course.
 */
export function useDesktopProject() {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();

  const newProject = () => {
    const lesson: ILesson = {
      id: `lesson-${Date.now()}`,
      name: "Untitled lesson",
      description: "",
      actions: [],
    };
    dispatch(addNewLessonToProjects(lesson));
  };

  const open = async () => {
    try {
      const file = await openProjectFile();
      if (!file) return;
      let data: unknown;
      try {
        data = JSON.parse(file.contents);
      } catch {
        throw new Error("That file isn't JSON.");
      }
      if (isCourse(data as Project))
        dispatch(addNewCourseToProjects(data as ICourse));
      else if (isLesson(data as Project))
        dispatch(addNewLessonToProjects(data as ILesson));
      else if (Array.isArray(data) && isValidActions(data as IAction[]).isValid)
        dispatch(addNewActionsToProjects(data as IAction[]));
      else
        throw new Error(
          "That file isn't a CodeVideo project (actions, a lesson or a course).",
        );
      const created = store.getState().editor.currentProject?.created;
      if (created) rememberFile(created, file.path);
    } catch (e) {
      dispatch(
        addToast(
          e instanceof Error ? e.message : "Could not open the project.",
        ),
      );
    }
  };

  const save = async (saveAs = false) => {
    const current = store.getState().editor.currentProject;
    if (!current) return;
    try {
      const path = await saveProjectFile(
        JSON.stringify(current.project, null, 2),
        fileNameFor(current.project, "json"),
        saveAs ? undefined : projectFiles()[current.created],
      );
      if (!path) return;
      rememberFile(current.created, path);
      dispatch(addToast(`Saved to ${path}`));
    } catch (e) {
      dispatch(
        addToast(
          e instanceof Error ? e.message : "Could not save the project.",
        ),
      );
    }
  };

  return { newProject, open, save };
}
