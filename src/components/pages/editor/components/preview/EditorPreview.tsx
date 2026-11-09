import { useMemo } from "react";
import { useClerk } from "@clerk/clerk-react";
import { CodeVideoIDE } from "@fullstackcraftllc/codevideo-ide-react";
import { isCourse } from "@fullstackcraftllc/codevideo-types";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { RENDER_PAUSES } from "../../../../../utils/estimateVideoDurationInSeconds";
import { buildSpeakActionAudios } from "../../../../../utils/speech/speechAudio";
import { TransportControls } from "../toolbar/TransportControls";
import { Timecode } from "../toolbar/Timecode";
import { TimelineLayout } from "../../utils/timelineLayout";
import { Playback } from "../../hooks/usePlayback";
export function EditorPreview({ playback, layout }: { playback: Playback; layout: TimelineLayout }) {
  const clerk = useClerk();
  const {
    currentProject,
    currentActions,
    currentActionIndex,
    currentLessonIndex,
    allowFocusInEditor,
    isSoundOn,
  } = useAppSelector((s) => s.editor);
  const { theme } = useAppSelector((s) => s.theme);
  const takes = useAppSelector((s) => s.speech.takesByText);
  const audios = useMemo(
    () => buildSpeakActionAudios(currentActions, takes),
    [currentActions, takes],
  );
  return (
    <section
      className="cv-preview-area"
      aria-label="IDE preview"
    >
      <div data-editor-preview className="cv-preview-frame">
        {clerk.loaded && currentProject ? (
          <CodeVideoIDE
            theme={theme}
            project={currentProject.project}
            mode={playback.isPlaying ? "replay" : "step"}
            currentActionIndex={currentActionIndex}
            currentLessonIndex={currentLessonIndex}
            allowFocusInEditor={allowFocusInEditor}
            resolution="1080p"
            defaultLanguage={
              isCourse(currentProject.project)
                ? currentProject.project.primaryLanguage
                : "javascript"
            }
            isExternalBrowserStepUrl={null}
            isSoundOn={isSoundOn && playback.isPlaying}
            withCaptions
            actionFinishedCallback={playback.finished}
            speakActionAudios={audios}
            {...RENDER_PAUSES}
          />
        ) : (
          <p className="cv-preview-loading">Loading preview…</p>
        )}
      </div>
      <div className="cv-preview-controls">
        <Timecode playback={playback} layout={layout} />
        <TransportControls playback={playback} />
        <span className="cv-preview-format">16:9 · 1080p</span>
      </div>
    </section>
  );
}
