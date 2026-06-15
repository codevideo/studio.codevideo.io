import * as React from "react"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { JsonLd } from "../components/JsonLd"
import { FAQs } from "../components/pages/faq/FAQ"

const siteUrl = "https://studio.codevideo.io"

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there a free trial available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer 50 free tokens when you sign up to try out CodeVideo.",
      },
    },
    {
      "@type": "Question",
      name: "Can I change my plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Our plans can scale with you as you get more comfortable with CodeVideo and your content creation needs change. At any time, you can upgrade or downgrade and we'll just prorate the difference.",
      },
    },
    {
      "@type": "Question",
      name: "What is the cancellation policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can cancel at any time. Your subscription will remain active until the end of your current billing period.",
      },
    },
    {
      "@type": "Question",
      name: "What is your refund policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you cancel, your subscription will remain active for the remainder of your paid billing period. In extraordinary cases, a CodeVideo Lifetime License can be refunded, but typically these are considered as long term supporters and users of the CodeVideo framework.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to download anything?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, CodeVideo is a web-based platform that runs completely in your browser which means you never have to download any local desktop software.",
      },
    },
    {
      "@type": "Question",
      name: "What are tokens and how do they work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tokens are our currency for creating exports. Each token allows you to create professional educational content. Plans include: Starter ($10/month for 50 tokens), Creator ($49/month for 500 tokens), Enterprise ($499/month for 10,000 tokens), Pay-as-you-go ($2 for 10 tokens), and Lifetime ($2,000 one-time payment).",
      },
    },
    {
      "@type": "Question",
      name: "How long do tokens last?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tokens never expire: tokens from monthly subscriptions roll over at the end of each billing cycle. Even when you already have a subscription, you can always purchase additional tokens if you are running low.",
      },
    },
    {
      "@type": "Question",
      name: "Can I share tokens with my team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! The enterprise plan is designed for team collaboration and sharing your account tokens with team members. Get in touch with us if you're looking for custom team solutions, integrations, or connectors.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get started?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Getting started is easy! Simply sign up for an account, get your free tokens, and start creating professional educational videos in minutes. Upgrade to other plans or top up at anytime.",
      },
    },
  ],
}

export default function Studio() {
  return (
    <Layout withHeader={true}>
      <SEO
        title="FAQs — CodeVideo Studio"
        description="Frequently asked questions about CodeVideo Studio pricing, tokens, plans, and getting started with declarative video creation."
        pathname="/faq"
      />
      <JsonLd schema={faqPageSchema} />
      <FAQs isMainPage={true} />
    </Layout>
  )
}
