import * as React from "react"
import { Layout } from "../components/layout/Layout"
import { LoginPage } from "../components/pages/login/LoginPage"
import SEO from "../components/layout/SEO"

export default function Home() {
  return (
    <Layout withHeader={false}>
      <SEO title="CodeVideo: Login" />
      <LoginPage />
    </Layout>
  )
}
