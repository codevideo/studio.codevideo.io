import { isCourse } from "@fullstackcraftllc/codevideo-types";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import {
  setCurrentLessonIndex,
  setIsPlaying,
} from "../../../../../store/editorSlice";
export function LessonSelect() {
  const { currentProject, currentLessonIndex } = useAppSelector(
    (s) => s.editor,
  );
  const dispatch = useAppDispatch();
  const p = currentProject?.project;
  if (!p || !isCourse(p)) return null;
  return (
    <select
      aria-label="Lesson"
      value={currentLessonIndex}
      onChange={(e) => {
        dispatch(setIsPlaying(false));
        dispatch(setCurrentLessonIndex(Number(e.target.value)));
      }}
    >
      {p.lessons.map((l, i) => (
        <option key={l.id + "-" + i} value={i}>
          {l.name}
        </option>
      ))}
    </select>
  );
}
