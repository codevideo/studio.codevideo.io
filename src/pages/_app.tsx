import * as React from "react"
import type { AppProps } from "next/app"
import Link from "next/link"
import { useRouter } from "next/router"
import { Provider } from "react-redux"
import { ClerkProvider } from "@clerk/clerk-react"
import { loader } from "@monaco-editor/react"
import mixpanel from "mixpanel-browser"
import { useMonacoCancellationHandling } from "../hooks/useMonacoCancellationHandling"
import { IS_DESKTOP } from "../runtime/environment"
import createStore from "../store/index"
import "../styles/global.css"
import "../styles/editor.css"
import "@radix-ui/themes/styles.css"
import "../styles/toast.css"

// Monaco loads from this site (scripts/copy-monaco.mjs puts it in public/monaco),
// not from a CDN, so the desktop app works offline.
loader.config({ paths: { vs: "/monaco/vs" } })

// The desktop app has no analytics and no account.
if (typeof window !== "undefined" && !IS_DESKTOP) {
  mixpanel.init("c8c5a06f15183f151523a4681b649e3b", {
    debug: false,
    track_pageview: true,
    persistence: "localStorage",
  })
}

// The desktop app is the editor only. The other pages need an account (Clerk),
// so they render a pointer to the editor instead, and never call Clerk's hooks.
const DESKTOP_PAGES = new Set(["/editor"])

function DesktopPageNotAvailable() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h1>This page is part of the web studio</h1>
      <p>
        The desktop app has the editor. <Link href="/editor/">Open the editor</Link>
      </p>
    </main>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  useMonacoCancellationHandling()
  const router = useRouter()
  // App re-renders on every navigation, and the store has to outlive those:
  // it holds the editor's state.
  const [store] = React.useState(() => createStore())
  if (IS_DESKTOP) {
    return (
      <Provider store={store}>
        {DESKTOP_PAGES.has(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <DesktopPageNotAvailable />
        )}
      </Provider>
    )
  }
  const page = (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}>
      {page}
    </ClerkProvider>
  )
}
