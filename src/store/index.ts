
import { configureStore } from '@reduxjs/toolkit'
import editorSlice from './editorSlice'
import recordingSlice from './recordingSlice'
import userSlice from './userSlice'
import modalSlice from './modalSlice'
import toastSlice from './toastSlice'
import themeSlice from './themeSlice'
import tutorialSlice from './tutorialSlice'

const createStore = () =>
    configureStore({
        reducer: {
            theme: themeSlice,
            editor: editorSlice,
            recording: recordingSlice,
            user: userSlice,
            modal: modalSlice,
            toast: toastSlice,
            tutorial: tutorialSlice,
        }
    })


type ConfiguredStore = ReturnType<typeof createStore>
type StoreGetState = ConfiguredStore["getState"]
export type RootState = ReturnType<StoreGetState>
export type AppDispatch = ConfiguredStore["dispatch"]

export default createStore

