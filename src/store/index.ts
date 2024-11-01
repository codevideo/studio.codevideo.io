
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import editorSlice, { editorInitialState } from './editorSlice'
import userSlice, { userInitialState } from './userSlice'


export const initialState = {
    editor: editorInitialState,
    user: userInitialState
}

const persistConfig = {
    key: 'root',
    storage,
    blacklist: [ 'editor']
}

export const rootReducer = combineReducers({
    editor: editorSlice,
    user: userSlice
})

export const persistedReducer = persistReducer(persistConfig, rootReducer)

// export store
const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})

// configure and export types for hooks
type ConfiguredStore = typeof store
type StoreGetState = ConfiguredStore['getState']
export type RootState = ReturnType<StoreGetState>
export type AppDispatch = ConfiguredStore['dispatch']
