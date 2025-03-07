import * as React from "react"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { PaymentSuccessContent } from "../components/pages/payments/PaymentSuccessContent"

export default function SuccessStarter() {
  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo Starter Payment Success" />
      <PaymentSuccessContent tier="starter" />
    </Layout>
  )
}