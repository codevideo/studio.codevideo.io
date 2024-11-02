
import { configureStore } from '@reduxjs/toolkit'
import editorSlice from './editorSlice'
import userSlice from './userSlice'

const createStore = () =>
    configureStore({
        reducer: {
            editor: editorSlice,
            user: userSlice
        }
    })


type ConfiguredStore = ReturnType<typeof createStore>
type StoreGetState = ConfiguredStore["getState"]
export type RootState = ReturnType<StoreGetState>
export type AppDispatch = ConfiguredStore["dispatch"]

export default createStore

