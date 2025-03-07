import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  showSignUpOverlay: boolean
}

export const authInitialState: AuthState = {
  showSignUpOverlay: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setShowSignUpOverlay: (state, action) => {
      state.showSignUpOverlay = action.payload
    }
  }
})

export const { setShowSignUpOverlay } = authSlice.actions

export default authSlice.reducer
