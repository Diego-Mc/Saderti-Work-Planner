import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { ScheduleState, WorkerIdentifier } from '../../types'

////////////////////////////////////////////////////////////////

import { apiSlice } from './../api/apiSlice'

const schedulesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<ScheduleState[], void>({
      queryFn: async (query, queryApi, extraOptions, baseQuery) => {
        const result = await baseQuery('/schedules/')
        const data = result.data as ScheduleState[]
        data?.sort((a: ScheduleState, b: ScheduleState) => b.date - a.date)
        return { data }
      },
      providesTags: (res) =>
        res
          ? [
              ...res.map(
                ({ _id }: any) => ({ type: 'Schedules', id: _id } as const)
              ),
              { type: 'Schedules', id: 'LIST' },
            ]
          : [{ type: 'Schedules', id: 'LIST' }],
    }),
    getSchedule: builder.query<ScheduleState, string>({
      queryFn: async (scheduleId, queryApi, extraOptions, baseQuery) => {
        const result = await baseQuery(`/schedules/${scheduleId}`)
        const data = result.data as ScheduleState
        return { data }
      },
      providesTags: (res, err, scheduleId) => [
        { type: 'Schedules', id: scheduleId },
      ],
    }),
    addSchedule: builder.mutation({
      query: (schedule) => ({
        url: `/schedules/`,
        method: 'POST',
        body: schedule,
      }),
      async onQueryStarted(schedule, { dispatch, queryFulfilled }) {
        try {
          const { data: savedSchedule } = await queryFulfilled
          dispatch(
            schedulesApi.util.updateQueryData(
              'getSchedules',
              undefined,
              (schedules) => {
                schedules.push(savedSchedule)
              }
            )
          )
        } catch (err) {
          console.log(
            'error adding reply, invalidating {Schedules - LIST}',
            err
          )
          dispatch(
            schedulesApi.util.invalidateTags([
              { type: 'Schedules', id: 'LIST' },
            ])
          )
        }
      },
    }),
    moveWorkers: builder.mutation({
      query: ({ from, to, scheduleId }) => ({
        url: `/schedules/${scheduleId}/move-workers`,
        method: 'PATCH',
        body: { from, to },
      }),
      async onQueryStarted(
        { from, to, scheduleId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          schedulesApi.util.updateQueryData(
            'getSchedule',
            scheduleId,
            (schedule) => {
              const { machine, shiftTime, idx } = from
              const {
                machine: machineTo,
                shiftTime: shiftTimeTo,
                idx: idxTo,
              } = to
              const fromRow = schedule.table.find(
                (row) => row.machine === machine
              )
              const toRow = schedule.table.find(
                (row) => row.machine === machineTo
              )
              if (!toRow || !fromRow) return
              ;[fromRow.data[shiftTime][idx], toRow.data[shiftTimeTo][idxTo]] =
                [toRow.data[shiftTimeTo][idxTo], fromRow.data[shiftTime][idx]]
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log(
            'error move workers, invalidating {Schedules - scheduleId}',
            err
          )
          dispatch(
            schedulesApi.util.invalidateTags([
              { type: 'Schedules', id: scheduleId },
            ])
          )
        }
      },
    }),
    toggleLock: builder.mutation({
      query: ({ workerDetails, scheduleId }) => ({
        url: `/schedules/${scheduleId}/toggle-lock`,
        method: 'PATCH',
        body: { workerDetails },
      }),
      async onQueryStarted(
        { workerDetails, scheduleId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          schedulesApi.util.updateQueryData(
            'getSchedule',
            scheduleId,
            (schedule) => {
              const { machineId, shiftTime, idx } = workerDetails
              const row = schedule.table.find(
                (row) => row.machine._id === machineId
              )
              if (!row) return
              row.locked[shiftTime][idx] = !row.locked[shiftTime][idx]
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log(
            'error toggle lock, invalidating {Schedules - scheduleId}',
            err
          )
          dispatch(
            schedulesApi.util.invalidateTags([
              { type: 'Schedules', id: scheduleId },
            ])
          )
        }
      },
    }),
    saveSchedule: builder.mutation({
      query: ({ scheduleDetails, scheduleId }) => ({
        url: `/schedules/${scheduleId}`,
        method: 'POST',
      }),
      async onQueryStarted(
        { scheduleDetails, scheduleId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          schedulesApi.util.updateQueryData(
            'getSchedule',
            scheduleId,
            (schedule) => {
              schedule.date = scheduleDetails.date
              schedule.table = scheduleDetails.table
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log('error save, invalidating {Schedules - scheduleId}', err)
          dispatch(
            schedulesApi.util.invalidateTags([
              { type: 'Schedules', id: scheduleId },
            ])
          )
        }
      },
    }),
    deleteSchedule: builder.mutation({
      query: (scheduleId) => ({
        url: `/posts/${scheduleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (res, err, scheduleId) => [
        { type: 'Schedules', id: scheduleId },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetSchedulesQuery,
  useGetScheduleQuery,
  useAddScheduleMutation,
  useDeleteScheduleMutation,
  useMoveWorkersMutation,
  useToggleLockMutation,
  useSaveScheduleMutation,
} = schedulesApi

////////////////////////////////////////////////////////////////

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
      const { machineId, shiftTime, idx } = from
      const { machineId: machineIdTo, shiftTime: shiftTimeTo, idx: idxTo } = to
      if (!schedule) return
      const fromRow = schedule.table.find(
        (row) => row.machine._id === machineId
      )
      const toRow = schedule.table.find(
        (row) => row.machine._id === machineIdTo
      )
      if (!toRow || !fromRow) return
      ;[fromRow.data[shiftTime][idx], toRow.data[shiftTimeTo][idxTo]] = [
        toRow.data[shiftTimeTo][idxTo],
        fromRow.data[shiftTime][idx],
      ]
    },
    toggleLock: (state, action: PayloadAction<WorkerIdentifier>) => {
      const { machineId, shiftTime, idx } = action.payload
      const schedule = state.schedules.find(
        (s) => s._id === state.currScheduleId
      )
      if (!schedule) return

      const row = schedule.table.find((row) => row.machine._id === machineId)
      if (!row) return

      row.locked[shiftTime][idx] = !row.locked[shiftTime][idx]
    },
  },
})

export const { moveWorkers, toggleLock, addSchedule } = SchedulesSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSchedules = (state: RootState) => state.schedules

export default SchedulesSlice.reducer
