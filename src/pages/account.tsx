import * as React from "react"
import { Layout } from "../components/layout/Layout"
import SEO from "../components/layout/SEO"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"
import { AccountPage } from "../components/pages/account/AccountPage"

export default function Account() {
  return (
    <Layout withHeader={true}>
      <SEO title="CodeVideo Studio Account" pathname="/account" noIndex={true} />
      <SignedIn>
          <AccountPage />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
    </Layout>
  )
}
