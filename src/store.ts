import { configureStore } from '@reduxjs/toolkit'
import workersReducer from './features/workers/workersSlice'
import schedulesReducer from './features/schedules/schedulesSlice'

export const store = configureStore({
  reducer: {
    workers: workersReducer,
    schedules: schedulesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
