import { createSlice } from '@reduxjs/toolkit'

export interface FormsState {
  isContactSuccessful: boolean
  isSubmitting: boolean
}

export const formsInitialState: FormsState = {
  isContactSuccessful: false,
  isSubmitting: false
}

export const formsSlice = createSlice({
  name: 'forms',
  initialState: formsInitialState,
  reducers: {
    setContactSuccessful: (state) => {
      state.isContactSuccessful = true
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload
    }
  }
})

export const { setContactSuccessful, setIsSubmitting } = formsSlice.actions

export default formsSlice.reducer
