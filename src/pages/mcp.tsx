import * as React from "react"
import { MCPPage } from "../components/pages/mcp/MCPPage"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"

export default function MCP() {

  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo MCP" />
      <MCPPage />
    </Layout>
  )
}
