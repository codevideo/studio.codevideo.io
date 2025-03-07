import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  showSignUpOverlay: boolean
  showSignInOverlay: boolean
  tokenRefresh: boolean
}

export const authInitialState: AuthState = {
  showSignUpOverlay: false,
  showSignInOverlay: false,
  tokenRefresh: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setShowSignUpOverlay: (state, action) => {
      state.showSignUpOverlay = action.payload
    },
    setShowSignInOverlay: (state, action) => {
      state.showSignInOverlay = action.payload
    },
    signalTokenRefresh: (state) => {
      state.tokenRefresh = !state.tokenRefresh
    }
  }
})

export const { setShowSignUpOverlay, setShowSignInOverlay, signalTokenRefresh } = authSlice.actions

export default authSlice.reducer
