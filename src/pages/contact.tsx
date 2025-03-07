import * as React from "react"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { Contact } from "../components/contact/Contact"

export default function ContactPage() {
  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo: Contact" />
      <Contact/>
    </Layout>
  )
}