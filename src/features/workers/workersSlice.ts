////////////////////////////////////////////////////////////////

import { apiSlice } from './../api/apiSlice'
import { WorkerState } from '../../types'

export const workersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkers: builder.query<WorkerState[], void>({
      queryFn: async (query, queryApi, extraOptions, baseQuery) => {
        const result = await baseQuery('/workers/')
        const data = result.data as WorkerState[]
        data?.sort((a: WorkerState, b: WorkerState) =>
          a.name.localeCompare(b.name)
        )
        return { data }
      },
      providesTags: (res) =>
        res
          ? [
              ...res.map(
                ({ _id }: any) => ({ type: 'Workers', id: _id } as const)
              ),
              { type: 'Workers', id: 'LIST' },
            ]
          : [{ type: 'Workers', id: 'LIST' }],
    }),
    getWorker: builder.query<WorkerState, string>({
      queryFn: async (workerId, queryApi, extraOptions, baseQuery) => {
        const result = await baseQuery(`/workers/${workerId}`)
        const data = result.data as WorkerState
        return { data }
      },
      providesTags: (res, err, workerId) => [{ type: 'Workers', id: workerId }],
    }),
    addWorker: builder.mutation<WorkerState, string>({
      query: (workerName) => ({
        url: `/workers/`,
        method: 'POST',
        body: { name: workerName },
      }),
      invalidatesTags: ['Statistics'],
      async onQueryStarted(workerName, { dispatch, queryFulfilled }) {
        try {
          const { data: savedWorker } = await queryFulfilled
          dispatch(
            workersApi.util.updateQueryData(
              'getWorkers',
              undefined,
              (workers) => {
                workers.push(savedWorker)
              }
            )
          )
        } catch (err) {
          console.log('error adding worker, invalidating {Workers - LIST}', err)
          dispatch(
            workersApi.util.invalidateTags([{ type: 'Workers', id: 'LIST' }])
          )
        }
      },
    }),
    setShiftTime: builder.mutation({
      query: ({ shiftTime, workerId }) => ({
        url: `/workers/${workerId}/set-shift-time`,
        method: 'PATCH',
        body: { shiftTime },
      }),

      async onQueryStarted(
        { shiftTime, workerId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          workersApi.util.updateQueryData('getWorker', workerId, (worker) => {
            worker.shiftTime = shiftTime
          })
        )
        dispatch(
          workersApi.util.updateQueryData(
            'getWorkers',
            undefined,
            (workers) => {
              const foundWorker = workers.find(
                (worker) => worker._id === workerId
              )
              if (foundWorker) foundWorker.shiftTime = shiftTime
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log(
            'error toggle lock, invalidating {Workers - workerId}',
            err
          )
          dispatch(
            workersApi.util.invalidateTags([{ type: 'Workers', id: workerId }])
          )
        }
      },
    }),
    resetShiftTimes: builder.mutation<void, void>({
      query: () => ({
        url: `/workers/reset-shift-times`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Workers'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(
          workersApi.util.updateQueryData(
            'getWorkers',
            undefined,
            (workers) => {
              workers.forEach((w) => (w.shiftTime = ''))
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log('error toggle lock, invalidating {Workers - LIST}', err)
          dispatch(
            workersApi.util.invalidateTags([{ type: 'Workers', id: 'LIST' }])
          )
        }
      },
    }),
    saveWorker: builder.mutation({
      query: ({ workerDetails, workerId }) => ({
        url: `/workers/${workerId}/save`,
        method: 'POST',
        body: workerDetails,
      }),
      invalidatesTags: ['Statistics'],
      async onQueryStarted(
        { workerDetails, workerId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          workersApi.util.updateQueryData('getWorker', workerId, (worker) => {
            worker.name = workerDetails.name
            worker.shiftTime = workerDetails.shiftTime
            worker.ownerId = workerDetails.ownerId
          })
        )
        dispatch(
          workersApi.util.updateQueryData(
            'getWorkers',
            undefined,
            (workers) => {
              const workerIdx = workers.findIndex(
                (w) => w._id === workerDetails._id
              )
              if (workerDetails.ownerId === null) {
                workers.splice(workerIdx, 1)
              } else {
                workers[workerIdx].shiftTime = workerDetails.shiftTime
                workers[workerIdx].name = workerDetails.name
              }
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log('error save, invalidating {Workers - workerId}', err)
          dispatch(
            workersApi.util.invalidateTags([{ type: 'Workers', id: workerId }])
          )
        }
      },
    }),
    deleteWorker: builder.mutation({
      query: (workerId) => ({
        url: `/posts/${workerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (res, err, workerId) => [
        { type: 'Workers', id: workerId },
        { type: 'Workers', id: 'LIST' },
        { type: 'Statistics' },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useAddWorkerMutation,
  useDeleteWorkerMutation,
  useGetWorkerQuery,
  useGetWorkersQuery,
  useSaveWorkerMutation,
  useSetShiftTimeMutation,
  useResetShiftTimesMutation,
} = workersApi

////////////////////////////////////////////////////////////////

// Define a type for the slice state

// type WorkerIdentifier = {
//   _id: string
//   timeShift: string
// }

// interface WorkersState {
//   workers: WorkerState[]
// }

// Define the initial state using that type
// const initialState = {
//   workers: [],
// } as WorkersState

// export const WorkersSlice = createSlice({
//   name: 'workers',
//   // `createSlice` will infer the state type from the `initialState` argument
//   initialState,
//   reducers: {
//     // Use the PayloadAction type to declare the contents of `action.payload`
//     setTimeShift: (state, action: PayloadAction<WorkerIdentifier>) => {
//       const { _id, timeShift } = action.payload
//       const worker = state.workers.find((w) => w._id === _id)
//       if (!worker) return
//       worker.shiftTime = timeShift
//     },
//     resetTimeShifts: (state) => {
//       state.workers.forEach((w) => (w.shiftTime = ''))
//     },
//     addWorker: (state, action: PayloadAction<WorkerState>) => {
//       const { _id, shiftTime, name } = action.payload
//       const worker = state.workers.find((w) => w._id === _id)
//       if (worker) return
//       state.workers.push(action.payload)
//     },
//   },
// })

// export const { setTimeShift, addWorker, resetTimeShifts } = WorkersSlice.actions

// // Other code such as selectors can use the imported `RootState` type
// export const selectWorkers = (state: RootState) => state.workers

// export default WorkersSlice.reducer
