import * as React from "react"
import {HomePage} from "../components/pages/home/HomePage"
import { Layout } from "../components/layout/Layout"

export default function Home() {
  return <Layout withHeader={false}><HomePage/></Layout>
}
