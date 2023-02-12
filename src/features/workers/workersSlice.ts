import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

// Define a type for the slice state
type WorkerState = {
  name: string
  currTimeShift: string
  _id: string
}

type WorkerIdentifier = {
  _id: string
  timeShift: string
}

interface WorkersState {
  workers: WorkerState[]
}

// Define the initial state using that type
const initialState = {
  workers: [],
} as WorkersState

export const WorkersSlice = createSlice({
  name: 'workers',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setTimeShift: (state, action: PayloadAction<WorkerIdentifier>) => {
      const { _id, timeShift } = action.payload
      const worker = state.workers.find((w) => w._id === _id)
      if (!worker) return
      worker.currTimeShift = timeShift
    },
    resetTimeShifts: (state) => {
      state.workers.forEach((w) => (w.currTimeShift = ''))
    },
    addWorker: (state, action: PayloadAction<WorkerState>) => {
      const { _id, currTimeShift, name } = action.payload
      const worker = state.workers.find((w) => w._id === _id)
      if (worker) return
      state.workers.push(action.payload)
    },
  },
})

export const { setTimeShift, addWorker, resetTimeShifts } = WorkersSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectWorkers = (state: RootState) => state.workers

export default WorkersSlice.reducer
