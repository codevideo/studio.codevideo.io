import { useEffect } from "react";
import { useStore } from "react-redux";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import useUtmTracking from "./useUtmTracking";
import {
  setProjects,
  setCurrentProjectIndex,
  setCurrentLessonIndex,
} from "../store/editorSlice";
import { loadProjectsFromLocalStorage } from "../utils/persistence/loadProjectsFromLocalStorage";
import { hydrateSpeech } from "../store/speechSlice";
import { loadSpeech, saveSpeech } from "../utils/persistence/speechPersistence";
import { RootState } from "../store";
const POSITION_KEY = "CODEVIDEO_OPEN_PROJECT";
export function useStudioBootstrap() {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const { currentProject, currentLessonIndex } = useAppSelector(
    (s) => s.editor,
  );
  useUtmTracking();
  useEffect(() => {
    window.speechSynthesis?.getVoices();
    const timer = setTimeout(() => window.speechSynthesis?.getVoices(), 3000);
    if (!store.getState().editor.projects.length) {
      dispatch(setProjects(loadProjectsFromLocalStorage()));
      try {
        const saved = JSON.parse(localStorage.getItem(POSITION_KEY) ?? "null");
        const projects = store.getState().editor.projects;
        const index = projects.findIndex((p) => p.created === saved?.created);
        if (index >= 0) {
          dispatch(setCurrentProjectIndex(index));
          const project = projects[index]?.project;
          if (project && !Array.isArray(project) && "lessons" in project) {
            const lesson = project.lessons.findIndex(
              (l) => l.id === saved.lessonId,
            );
            if (lesson >= 0) dispatch(setCurrentLessonIndex(lesson));
          }
        }
      } catch {}
    }
    dispatch(hydrateSpeech(loadSpeech()));
    let lastSpeech = store.getState().speech;
    const unsubscribe = store.subscribe(() => {
      const s = store.getState().speech;
      if (s === lastSpeech) return;
      lastSpeech = s;
      try {
        if (s.hydrated) saveSpeech(s);
      } catch {}
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [dispatch, store]);
  useEffect(() => {
    if (!currentProject) return;
    try {
      const p = currentProject.project;
      localStorage.setItem(
        POSITION_KEY,
        JSON.stringify({
          created: currentProject.created,
          lessonId:
            !Array.isArray(p) && "lessons" in p
              ? p.lessons[currentLessonIndex]?.id
              : undefined,
        }),
      );
    } catch {}
  }, [currentProject, currentLessonIndex]);
}
