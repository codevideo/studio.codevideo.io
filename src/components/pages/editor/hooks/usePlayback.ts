import { useEffect, useRef } from "react";
import { useStore } from "react-redux";
import { RootState } from "../../../../store";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import {
  setCurrentActionIndex,
  setIsPlaying,
} from "../../../../store/editorSlice";
export function usePlayback(scope: string) {
  const { isPlaying, currentActionIndex, currentActions } = useAppSelector(
    (s) => s.editor,
  );
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const clock = useRef({
    index: currentActionIndex,
    startedAt: 0,
    playing: isPlaying,
  });
  // Updated synchronously so a newly committed index cannot render using the previous clip's clock.
  if (
    clock.current.index !== currentActionIndex ||
    clock.current.playing !== isPlaying
  )
    clock.current = {
      index: currentActionIndex,
      startedAt: typeof performance === "undefined" ? 0 : performance.now(),
      playing: isPlaying,
    };
  useEffect(() => {
    dispatch(setIsPlaying(false));
  }, [scope, dispatch]);
  const seek = (index: number) => {
    dispatch(setIsPlaying(false));
    dispatch(
      setCurrentActionIndex(
        Math.max(-1, Math.min(currentActions.length - 1, index)),
      ),
    );
  };
  const pause = () => {
    dispatch(setIsPlaying(false));
  };
  const play = (from?: number) => {
    if (!currentActions.length) return;
    const index =
      from ??
      (currentActionIndex >= currentActions.length - 1
        ? 0
        : currentActionIndex + 1);
    clock.current = { index, startedAt: performance.now(), playing: true };
    dispatch(setCurrentActionIndex(index));
    dispatch(setIsPlaying(true));
  };
  const finished = () => {
    const latest = store.getState().editor;
    if (
      !latest.isPlaying ||
      latest.currentActionIndex !== currentActionIndex ||
      latest.currentActions !== currentActions
    )
      return;
    if (currentActionIndex >= currentActions.length - 1)
      dispatch(setIsPlaying(false));
    else dispatch(setCurrentActionIndex(currentActionIndex + 1));
  };
  return {
    isPlaying,
    index: currentActionIndex,
    clock,
    seek,
    pause,
    play,
    finished,
  };
}
export type Playback = ReturnType<typeof usePlayback>;
