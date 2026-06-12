import * as React from "react"
import { StudioPage } from "../components/pages/studio/StudioPage"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { JsonLd } from "../components/JsonLd"
import { StudioTutorial } from "../components/layout/sidebar/StudioTutorial"

const siteUrl = "https://studio.codevideo.io"

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}#organization`,
  name: "Full Stack Craft LLC",
  url: "https://fullstackcraft.com",
  logo: `${siteUrl}/icons/icon-512x512.png`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hi@fullstackcraft.com",
  },
}

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}#website`,
  name: "CodeVideo Studio",
  url: siteUrl,
  description:
    "Build educational software videos in minutes, not weeks. A web-based IDE for declarative, action-based video creation with multi-format export.",
  publisher: {
    "@id": `${siteUrl}#organization`,
  },
}

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CodeVideo Studio",
  url: siteUrl,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "A web-based IDE for creating educational software videos using declarative, action-based video generation. Supports multi-format export to video, markdown, PDF, presentations, and web content.",
  offers: [
    {
      "@type": "Offer",
      name: "Free Trial",
      price: "0",
      priceCurrency: "USD",
      description: "50 free tokens to try CodeVideo Studio",
    },
    {
      "@type": "Offer",
      name: "Pay As You Go",
      price: "2",
      priceCurrency: "USD",
      description: "10 tokens",
    },
    {
      "@type": "Offer",
      name: "Creator",
      price: "49",
      priceCurrency: "USD",
      description: "500 tokens per month",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
    },
    {
      "@type": "Offer",
      name: "Lifetime",
      price: "499",
      priceCurrency: "USD",
      description: "One-time purchase, unlimited access",
    },
  ],
}

export default function Studio() {

  return (
    <Layout withHeader={true}>
      <SEO
        title="CodeVideo Studio — Create Educational Code Videos"
        description="Build educational software videos in minutes, not weeks. A web-based IDE for declarative, action-based video creation with multi-format export."
        pathname="/"
      />
      <JsonLd schema={[organizationSchema, webSiteSchema, softwareAppSchema]} />
      <StudioTutorial />
      <StudioPage />
    </Layout>
  )
}
