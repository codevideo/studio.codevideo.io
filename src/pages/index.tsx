import * as React from "react"
import { StudioPage } from "../components/pages/studio/StudioPage"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { StudioTutorial } from "../components/layout/sidebar/StudioTutorial"
import { useEffect } from "react"
import { loadProjectsFromLocalStorage } from "../utils/persistence/loadProjectsFromLocalStorage"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { setProjects } from "../store/editorSlice"

export default function Studio() {
  const dispatch = useAppDispatch();

  // bootstrap: load projects from local storage on mount
  useEffect(() => {
    console.log('loading projects from local storage');
    const projects = loadProjectsFromLocalStorage();
    dispatch(setProjects(projects));
  }, [])

  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo Studio" />
      <StudioTutorial />
      <StudioPage />
    </Layout>
  )
}
