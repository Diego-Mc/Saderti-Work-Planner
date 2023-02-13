import { configureStore } from '@reduxjs/toolkit'
import workersReducer from './features/workers/workersSlice'
import schedulesReducer from './features/schedules/schedulesSlice'
import machinesReducer from './features/machines/machinesSlice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { apiSlice } from './features/api/apiSlice'

export const store = configureStore({
  reducer: {
    workers: workersReducer,
    schedules: schedulesReducer,
    machines: machinesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
