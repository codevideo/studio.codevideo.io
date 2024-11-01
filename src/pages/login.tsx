import * as React from "react"
import { Layout } from "../components/layout/Layout"
import { LoginPage } from "../components/pages/login/LoginPage"

export default function Home() {
  return <Layout withHeader={false}><LoginPage/></Layout>
}
