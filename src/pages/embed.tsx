import * as React from "react"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { Contact } from "../components/contact/Contact"
import { Embed } from "../components/pages/embed/Embed"

export default function ContactPage() {
  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo: Embed Course or Lesson" />
      <Embed/>
    </Layout>
  )
}