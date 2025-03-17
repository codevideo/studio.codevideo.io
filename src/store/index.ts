
import { configureStore } from '@reduxjs/toolkit'
import editorSlice from './editorSlice'
import recordingSlice from './recordingSlice'
import modalSlice from './modalSlice'
import toastSlice from './toastSlice'
import themeSlice from './themeSlice'
import tutorialSlice from './tutorialSlice'
import formsSlice from './formsSlice'
import authSlice from './authSlice'

// we need preloaded state for the component embedder
// so we can pass the global state to the store
// and render the component with the global state
// in the component embedder
const createStore = (preloadedState = {}) =>
    configureStore({
        reducer: {
            theme: themeSlice,
            editor: editorSlice,
            recording: recordingSlice,
            modal: modalSlice,
            toast: toastSlice,
            tutorial: tutorialSlice,
            forms: formsSlice,
            auth: authSlice,
        },
        preloadedState,
    })


type ConfiguredStore = ReturnType<typeof createStore>
type StoreGetState = ConfiguredStore["getState"]
export type RootState = ReturnType<StoreGetState>
export type AppDispatch = ConfiguredStore["dispatch"]

export default createStore

