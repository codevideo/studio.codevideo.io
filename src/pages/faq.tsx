import * as React from "react"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { FAQs } from "../components/pages/faq/FAQ"

export default function Studio() {
  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo Studio: FAQs" />
      <FAQs isMainPage={true} />
    </Layout>
  )
}
