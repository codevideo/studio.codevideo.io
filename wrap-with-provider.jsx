import React from "react"
import { Provider } from "react-redux"
import { ClerkProvider } from "@clerk/clerk-react"
import createStore from "./src/store/index"

export default ({ element }) => {
  const store = createStore()
  return (
    <ClerkProvider publishableKey={process.env.GATSBY_CLERK_PUBLISHABLE_KEY || ''}>
      <Provider store={store}>
        {element}
      </Provider>
    </ClerkProvider>
  )
}
