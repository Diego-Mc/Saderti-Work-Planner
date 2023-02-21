import { ScheduleWorker } from './../../types'
import { ScheduleState } from '../../types'

////////////////////////////////////////////////////////////////

import { apiSlice } from './../api/apiSlice'

export const schedulesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<ScheduleState[], void>({
      queryFn: async (query, queryApi, extraOptions, baseQuery) => {
        const result = await baseQuery('/schedules/')
        const data = result.data as ScheduleState[]
        data?.sort(
          (a: ScheduleState, b: ScheduleState) => b.date.from - a.date.from
        )
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
      invalidatesTags: ['Statistics'],

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
      invalidatesTags: ['Statistics'],

      async onQueryStarted(
        { from, to, scheduleId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          schedulesApi.util.updateQueryData(
            'getSchedule',
            scheduleId,
            (schedule) => {
              const { machineId, shiftTime, idx } = from
              const {
                machineId: machineIdTo,
                shiftTime: shiftTimeTo,
                idx: idxTo,
              } = to
              const fromRow = schedule.table.find(
                (row) => row.machine._id === machineId
              )
              const toRow = schedule.table.find(
                (row) => row.machine._id === machineIdTo
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
    placeWorker: builder.mutation({
      query: ({ destinationDetails, worker, scheduleId }) => ({
        url: `/schedules/${scheduleId}/place-worker`,
        method: 'PATCH',
        body: { destinationDetails, worker },
      }),
      invalidatesTags: ['Statistics'],

      async onQueryStarted(
        { destinationDetails, worker, scheduleId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          schedulesApi.util.updateQueryData(
            'getSchedule',
            scheduleId,
            (schedule) => {
              const { machineId, shiftTime, idx } = destinationDetails
              const destinationRow = schedule.table.find(
                (row) => row.machine._id === machineId
              )
              if (!destinationRow) return
              if (destinationRow.locked[shiftTime][idx] === true)
                throw new Error("Can't place worker on locked cell")
              if (destinationRow.data[shiftTime][idx] !== null) {
                const currWorker = destinationRow.data[shiftTime][
                  idx
                ] as ScheduleWorker
                const usedIdx = schedule.workers.used.findIndex(
                  (w) => w._id === currWorker._id
                )
                schedule.workers.used.splice(usedIdx, 1)
                schedule.workers.unused.push(currWorker)
              }

              destinationRow.data[shiftTime][idx] = worker

              const unusedIdx = schedule.workers.unused.findIndex(
                (w) => w._id === worker._id
              )
              schedule.workers.unused.splice(unusedIdx, 1)
              schedule.workers.used.push(worker)
            }
          )
        )
        try {
          // console.log('yes im heer..')
          await queryFulfilled
        } catch (err) {
          console.log(
            'error place worker, invalidating {Schedules - scheduleId}',
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
    unplaceWorker: builder.mutation({
      query: ({ destinationDetails, worker, scheduleId }) => ({
        url: `/schedules/${scheduleId}/unplace-worker`,
        method: 'PATCH',
        body: { destinationDetails, worker },
      }),
      invalidatesTags: ['Statistics'],

      async onQueryStarted(
        { destinationDetails, worker, scheduleId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          schedulesApi.util.updateQueryData(
            'getSchedule',
            scheduleId,
            (schedule) => {
              const { machineId, shiftTime, idx } = destinationDetails
              const destinationRow = schedule.table.find(
                (row) => row.machine._id === machineId
              )
              if (!destinationRow) return
              destinationRow.data[shiftTime][idx] = null
              destinationRow.locked[shiftTime][idx] = false

              const usedIdx = schedule.workers.used.findIndex(
                (w) => w._id === worker._id
              )
              schedule.workers.used.splice(usedIdx, 1)
              schedule.workers.unused.push(worker)
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log(
            'error unplace worker, invalidating {Schedules - scheduleId}',
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
    changeMachineWorkersAmount: builder.mutation({
      query: ({ changeDetails, scheduleId }) => ({
        url: `/schedules/${scheduleId}/workers-amount`,
        method: 'PATCH',
        body: { changeDetails },
      }),
      async onQueryStarted(
        { changeDetails, scheduleId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          schedulesApi.util.updateQueryData(
            'getSchedule',
            scheduleId,
            (schedule) => {
              const { machineId, newAmount } = changeDetails
              const row = schedule.table.find(
                (row) => row.machine._id.toString() === machineId
              )
              if (!row) return

              const len = () => row.data.morning.length

              if (newAmount === len()) return

              row.machine.amountOfWorkers = newAmount

              if (newAmount > len()) {
                while (len() < newAmount) {
                  row.data.morning.push(null)
                  row.locked.morning.push(false)
                  row.data.evening.push(null)
                  row.locked.evening.push(false)
                  row.data.night.push(null)
                  row.locked.night.push(false)
                }
              }

              if (newAmount < len()) {
                let maxActualWorkers = Math.max(
                  row.data.morning.filter((w) => w !== null).length,
                  row.data.evening.filter((w) => w !== null).length,
                  row.data.night.filter((w) => w !== null).length
                )

                if (maxActualWorkers > newAmount)
                  throw new Error('more workers assigned than requested')

                for (let i = 0; newAmount < len(); i++) {
                  let shouldDecrement = false
                  ;['morning', 'evening', 'night'].forEach((time) => {
                    if (row.data[time][i] === null) {
                      row.data[time].splice(i, 1)
                      row.locked[time].splice(i, 1)
                      shouldDecrement = true
                    }
                  })
                  if (shouldDecrement) i--
                }
              }
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
    setDate: builder.mutation({
      query: ({ date, scheduleId }) => ({
        url: `/schedules/${scheduleId}/set-date`,
        method: 'PATCH',
        body: { date },
      }),
      async onQueryStarted({ date, scheduleId }, { dispatch, queryFulfilled }) {
        dispatch(
          schedulesApi.util.updateQueryData(
            'getSchedule',
            scheduleId,
            (schedule) => {
              schedule.date.to = date.to
              schedule.date.from = date.from
            }
          )
        )
        dispatch(
          schedulesApi.util.updateQueryData(
            'getSchedules',
            undefined,
            (schedules) => {
              const schedule = schedules.find((s) => s._id === scheduleId)
              if (!schedule) return
              schedule.date.to = date.to
              schedule.date.from = date.from
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log(
            'error set date, invalidating {Schedules - scheduleId}',
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
      invalidatesTags: ['Statistics', { type: 'Schedules', id: 'LIST' }],
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
        url: `/schedules/${scheduleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (res, err, scheduleId) => [
        { type: 'Schedules', id: scheduleId },
        { type: 'Schedules', id: 'LIST' },
        { type: 'Statistics', id: 'LIST' },
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
  usePlaceWorkerMutation,
  useSetDateMutation,
  useChangeMachineWorkersAmountMutation,
  useUnplaceWorkerMutation,
} = schedulesApi

////////////////////////////////////////////////////////////////

// Define a type for the slice state

// interface SchedulesState {
//   schedules: ScheduleState[]
//   currScheduleId: string
// }

// // Define the initial state using that type
// const initialState: SchedulesState = {
//   schedules: [],
//   currScheduleId: '',
// } as SchedulesState

// export const SchedulesSlice = createSlice({
//   name: 'schedules',
//   // `createSlice` will infer the state type from the `initialState` argument
//   initialState,
//   reducers: {
//     // Use the PayloadAction type to declare the contents of `action.payload`
//     addSchedule: (state, action: PayloadAction<ScheduleState>) => {
//       const { _id, date, table } = action.payload
//       const schedule = state.schedules.find((s) => s._id === _id)
//       if (schedule) return
//       state.schedules.push(action.payload)
//       state.currScheduleId = _id
//     },
//     moveWorkers: (
//       state,
//       action: PayloadAction<{
//         from: WorkerIdentifier
//         to: WorkerIdentifier
//       }>
//     ) => {
//       const { from, to } = action.payload
//       const schedule = state.schedules.find(
//         (s) => s._id === state.currScheduleId
//       )
//       const { machineId, shiftTime, idx } = from
//       const { machineId: machineIdTo, shiftTime: shiftTimeTo, idx: idxTo } = to
//       if (!schedule) return
//       const fromRow = schedule.table.find(
//         (row) => row.machine._id === machineId
//       )
//       const toRow = schedule.table.find(
//         (row) => row.machine._id === machineIdTo
//       )
//       if (!toRow || !fromRow) return
//       ;[fromRow.data[shiftTime][idx], toRow.data[shiftTimeTo][idxTo]] = [
//         toRow.data[shiftTimeTo][idxTo],
//         fromRow.data[shiftTime][idx],
//       ]
//     },
//     toggleLock: (state, action: PayloadAction<WorkerIdentifier>) => {
//       const { machineId, shiftTime, idx } = action.payload
//       const schedule = state.schedules.find(
//         (s) => s._id === state.currScheduleId
//       )
//       if (!schedule) return

//       const row = schedule.table.find((row) => row.machine._id === machineId)
//       if (!row) return

//       row.locked[shiftTime][idx] = !row.locked[shiftTime][idx]
//     },
//   },
// })

// export const { moveWorkers, toggleLock, addSchedule } = SchedulesSlice.actions

// // Other code such as selectors can use the imported `RootState` type
// export const selectSchedules = (state: RootState) => state.schedules

// export default SchedulesSlice.reducer
