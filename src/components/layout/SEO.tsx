import * as React from "react"
import Head from "next/head"

const siteUrl = "https://studio.codevideo.io"
const defaultDescription = "Make educational software videos in minutes, not weeks"
const defaultOgImage = `${siteUrl}/og.png`

export interface ISEOProps {
  title: string
  description?: string
  pathname?: string
  ogType?: string
  ogImage?: string
  noIndex?: boolean
}

function SEO(props: ISEOProps) {
  const { description, title, pathname, ogType, ogImage, noIndex } = props

  const metaDescription = description || defaultDescription
  // Pages live at /faq/, not /faq, so that's the URL to name (same as the sitemap).
  const canonical = pathname ? `${siteUrl}${pathname.replace(/\/?$/, "/")}` : `${siteUrl}/`
  const image = ogImage || defaultOgImage
  const type = ogType || "website"

  return (
    <Head>
      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="CodeVideo Studio" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={image} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}

export default SEO
