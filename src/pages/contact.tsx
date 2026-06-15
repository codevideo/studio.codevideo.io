import * as React from "react"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { Contact } from "../components/contact/Contact"

export default function ContactPage() {
  return (
    <Layout withHeader={true}>
      <SEO title="Contact — CodeVideo Studio" description="Get in touch with the CodeVideo team for any questions, concerns, or ideas to make CodeVideo better." pathname="/contact" />
      <Contact/>
    </Layout>
  )
}