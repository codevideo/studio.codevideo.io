import * as React from "react"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { PaymentSuccessContent } from "../components/pages/payments/PaymentSuccessContent"

export default function SuccessEnterprise() {
  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo Enterprise Payment Success" />
      <PaymentSuccessContent tier="enterprise" />
    </Layout>
  )
}