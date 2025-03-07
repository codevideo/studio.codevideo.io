import * as React from "react"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { PaymentSuccessContent } from "../components/pages/payments/PaymentSuccessContent"

export default function SuccessCreator() {
  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo Creator Payment Success" />
      <PaymentSuccessContent tier="creator" />
    </Layout>
  )
}