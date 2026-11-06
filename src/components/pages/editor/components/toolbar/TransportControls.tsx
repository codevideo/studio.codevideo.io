import { IconButton } from "@radix-ui/themes";
import {
  PlayIcon,
  PauseIcon,
  TrackPreviousIcon,
  TrackNextIcon,
} from "@radix-ui/react-icons";
import { SoundToggleButton } from "../../../studio/components/main/SoundToggleButton";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { setIsSoundOn } from "../../../../../store/editorSlice";
import { Playback } from "../../hooks/usePlayback";
export function TransportControls({ playback }: { playback: Playback }) {
  const { isSoundOn, currentActions } = useAppSelector((s) => s.editor);
  const dispatch = useAppDispatch();
  return (
    <div className="cv-transport">
      <IconButton
        variant="ghost"
        aria-label="Previous action"
        onClick={() => playback.seek(playback.index - 1)}
        disabled={playback.index < 0}
      >
        <TrackPreviousIcon />
      </IconButton>
      <IconButton
        aria-label={playback.isPlaying ? "Pause" : "Play"}
        disabled={!currentActions.length}
        onClick={() =>
          playback.isPlaying ? playback.pause() : playback.play()
        }
      >
        {playback.isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
      <IconButton
        variant="ghost"
        aria-label="Next action"
        disabled={playback.index >= currentActions.length - 1}
        onClick={() => playback.seek(playback.index + 1)}
      >
        <TrackNextIcon />
      </IconButton>
      <SoundToggleButton
        isSoundOn={isSoundOn}
        setIsSoundOn={(value) => dispatch(setIsSoundOn(value))}
      />
    </div>
  );
}
