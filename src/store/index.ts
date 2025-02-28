
import { configureStore } from '@reduxjs/toolkit'
import editorSlice from './editorSlice'
import recordingSlice from './recordingSlice'
import userSlice from './userSlice'
import modalSlice from './modalSlice'
import themeSlice from './themeSlice'

const createStore = () =>
    configureStore({
        reducer: {
            theme: themeSlice,
            editor: editorSlice,
            recording: recordingSlice,
            user: userSlice,
            modal: modalSlice,
        }
    })


type ConfiguredStore = ReturnType<typeof createStore>
type StoreGetState = ConfiguredStore["getState"]
export type RootState = ReturnType<StoreGetState>
export type AppDispatch = ConfiguredStore["dispatch"]

export default createStore

