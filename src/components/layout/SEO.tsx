import * as React from "react"
import { Helmet } from "react-helmet"
import config from "../../../gatsby-config"

export interface ISEOProps {
  title: string
  description?: string
}

function SEO(props: ISEOProps) {
  const { description, title } = props

  return (
    <Helmet htmlAttributes={{lang: 'en'}}>
      {/* General tags */}
      <title>{title}</title>
      <meta
        name="description"
        content={description || config.siteMetadata?.description as string  || ""}
      />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={description || config.siteMetadata?.description as string  || ""}
      />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={config.siteMetadata?.author as string || ""} />
      <meta name="twitter:title" content={title} />
      <meta
        name="twitter:description"
        content={description || config.siteMetadata?.description as string || ""}
      />
    </Helmet>
  )
}

export default SEO
