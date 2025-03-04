import * as React from "react"
import { StudioPage } from "../components/pages/studio/StudioPage"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { StudioTutorial } from "../components/pages/studio/components/sidebar/StudioTutorial"

export default function Studio() {
  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo Studio" />
      <StudioTutorial />
      <StudioPage />
    </Layout>
  )
}
