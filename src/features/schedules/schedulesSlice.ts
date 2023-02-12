import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { ScheduleState, WorkerIdentifier } from '../../types'

// Define a type for the slice state

interface SchedulesState {
  schedules: ScheduleState[]
  currScheduleId: string
}

// Define the initial state using that type
const initialState: SchedulesState = {
  schedules: [],
  currScheduleId: '',
} as SchedulesState

export const SchedulesSlice = createSlice({
  name: 'schedules',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addSchedule: (state, action: PayloadAction<ScheduleState>) => {
      const { _id, date, table } = action.payload
      const schedule = state.schedules.find((s) => s._id === _id)
      if (schedule) return
      state.schedules.push(action.payload)
      state.currScheduleId = _id
    },
    moveWorkers: (
      state,
      action: PayloadAction<{
        from: WorkerIdentifier
        to: WorkerIdentifier
      }>
    ) => {
      const { from, to } = action.payload
      const schedule = state.schedules.find(
        (s) => s._id === state.currScheduleId
      )
      const { machine, shiftTime, idx } = from
      const { machine: machineTo, shiftTime: shiftTimeTo, idx: idxTo } = to
      if (!schedule) return
      const fromRow = schedule.table.find((row) => row.machine === machine)
      const toRow = schedule.table.find((row) => row.machine === machineTo)
      if (!toRow || !fromRow) return
      ;[fromRow.data[shiftTime][idx], toRow.data[shiftTimeTo][idxTo]] = [
        toRow.data[shiftTimeTo][idxTo],
        fromRow.data[shiftTime][idx],
      ]
    },
    toggleLock: (state, action: PayloadAction<WorkerIdentifier>) => {
      const { machine, shiftTime, idx } = action.payload
      const schedule = state.schedules.find(
        (s) => s._id === state.currScheduleId
      )
      if (!schedule) return

      const row = schedule.table.find((row) => row.machine === machine)
      if (!row) return

      row.locked[shiftTime][idx] = !row.locked[shiftTime][idx]
    },
  },
})

export const { moveWorkers, toggleLock, addSchedule } = SchedulesSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSchedules = (state: RootState) => state.schedules

export default SchedulesSlice.reducer
