import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setAllowFocusInEditor } from "../../../store/editorSlice";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { speechMsByIndex } from "../../../utils/speech/speechAudio";
import { useActionIds } from "./hooks/useActionIds";
import { useEditorSelection } from "./hooks/useEditorSelection";
import { usePlayback } from "./hooks/usePlayback";
import { useEditActions } from "./hooks/useEditActions";
import { useTimelineLayout } from "./hooks/useTimelineLayout";
import { useEditorShortcuts } from "./hooks/useEditorShortcuts";
import { EditorTopBar } from "./components/toolbar/EditorTopBar";
import { EditorPreview } from "./components/preview/EditorPreview";
import { Inspector } from "./components/inspector/Inspector";
import { Timeline } from "./components/timeline/Timeline";
export function EditorPage() {
  const dispatch = useAppDispatch();
  const {
    currentProject,
    currentLessonIndex,
    currentActions: actions,
  } = useAppSelector((s) => s.editor);
  const takes = useAppSelector((s) => s.speech.takesByText);
  const scope = `${currentProject?.created}:${currentLessonIndex}`;
  const ids = useActionIds(actions, scope);
  const selection = useEditorSelection(ids);
  const pendingSelection = useRef<{ actions: IAction[]; index: number } | null>(
    null,
  );
  if (pendingSelection.current?.actions === actions) {
    selection.select(ids[pendingSelection.current.index] ?? null);
    pendingSelection.current = null;
  }
  const playback = usePlayback(scope);
  const edits = useEditActions(scope, playback, (index, next) => {
    pendingSelection.current = { actions: next, index };
  });
  const [zoom, setZoom] = useState(48);
  const speechMs = useMemo(
    () => speechMsByIndex(actions, takes),
    [actions, takes],
  );
  const layout = useTimelineLayout(actions, speechMs, zoom);
  const selectedIndex = selection.selectedId
    ? ids.indexOf(selection.selectedId)
    : -1;
  useEditorShortcuts(playback, edits, selectedIndex);
  const select = (id: string, index: number) => {
    selection.select(id || null);
    if (!playback.isPlaying && index >= 0) playback.seek(index);
  };
  return (
    <>
      <div className="cv-desktop-notice">
        <h1>A little more room to create</h1>
        <p>The timeline editor needs a screen at least 1024 pixels wide.</p>
        <Link href="/">Open the studio</Link>
      </div>
      {currentProject ? (
        <main
          className="cv-editor"
          onPointerDownCapture={(event) =>
            dispatch(
              setAllowFocusInEditor(
                !!(event.target as HTMLElement).closest(
                  "[data-editor-preview]",
                ),
              ),
            )
          }
          onFocusCapture={(event) => {
            if (!(event.target as HTMLElement).closest("[data-editor-preview]"))
              dispatch(setAllowFocusInEditor(false));
          }}
        >
          <EditorTopBar />
          <div className="cv-editor-main">
            <EditorPreview playback={playback} layout={layout} />
            <Inspector
              actions={actions}
              index={selectedIndex}
              id={selection.selectedId}
              edits={edits}
              layout={layout}
            />
          </div>
          <Timeline
            actions={actions}
            ids={ids}
            selectedId={selection.selectedId}
            select={select}
            edits={edits}
            playback={playback}
            layout={layout}
            zoom={zoom}
            setZoom={setZoom}
          />
        </main>
      ) : (
        <div className="cv-empty-state">
          <h1>Open a project to start editing</h1>
          <p>Your actions will appear here as video and audio clips.</p>
          <Link href="/">Open the studio →</Link>
        </div>
      )}
    </>
  );
}
