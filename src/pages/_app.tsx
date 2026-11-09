import * as React from "react"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { ClerkProvider } from "@clerk/clerk-react"
import mixpanel from "mixpanel-browser"
import { useMonacoCancellationHandling } from "../hooks/useMonacoCancellationHandling"
import createStore from "../store/index"
import "../styles/global.css"
import "../styles/editor.css"
import "@radix-ui/themes/styles.css"
import "../styles/toast.css"

if (typeof window !== "undefined") {
  mixpanel.init("c8c5a06f15183f151523a4681b649e3b", {
    debug: false,
    track_pageview: true,
    persistence: "localStorage",
  })
}

export default function App({ Component, pageProps }: AppProps) {
  useMonacoCancellationHandling()
  // App re-renders on every navigation, and the store has to outlive those:
  // it holds the editor's state.
  const [store] = React.useState(() => createStore())
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ClerkProvider>
  )
}
