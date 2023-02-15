import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { MachineState } from '../../types'

////////////////////////////////////////////////////////////////

import { apiSlice } from './../api/apiSlice'

export const machinesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMachines: builder.query<MachineState[], void>({
      queryFn: async (query, queryApi, extraOptions, baseQuery) => {
        const result = await baseQuery('/machines/')
        const data = result.data as MachineState[]
        data?.sort((a: MachineState, b: MachineState) =>
          a.name.localeCompare(b.name)
        )
        return { data }
      },
      providesTags: (res) =>
        res
          ? [
              ...res.map(
                ({ _id }: any) => ({ type: 'Machines', id: _id } as const)
              ),
              { type: 'Machines', id: 'LIST' },
            ]
          : [{ type: 'Machines', id: 'LIST' }],
    }),
    getMachine: builder.query<MachineState, string>({
      queryFn: async (machineId, queryApi, extraOptions, baseQuery) => {
        const result = await baseQuery(`/machines/${machineId}`)
        const data = result.data as MachineState
        return { data }
      },
      providesTags: (res, err, machineId) => [
        { type: 'Machines', id: machineId },
      ],
    }),
    addMachine: builder.mutation<MachineState, string>({
      query: (machineName) => ({
        url: `/machines/`,
        method: 'POST',
        body: { name: machineName },
      }),
      async onQueryStarted(machineName, { dispatch, queryFulfilled }) {
        try {
          const { data: savedMachine } = await queryFulfilled
          dispatch(
            machinesApi.util.updateQueryData(
              'getMachines',
              undefined,
              (machines) => {
                machines.push(savedMachine)
              }
            )
          )
        } catch (err) {
          console.log(
            'error adding machine, invalidating {Machines - LIST}',
            err
          )
          dispatch(
            machinesApi.util.invalidateTags([{ type: 'Machines', id: 'LIST' }])
          )
        }
      },
    }),
    saveMachine: builder.mutation({
      query: ({ machineDetails, machineId }) => ({
        url: `/machines/${machineId}/save`,
        method: 'POST',
        body: machineDetails,
      }),
      async onQueryStarted(
        { machineDetails, machineId },
        { dispatch, queryFulfilled }
      ) {
        dispatch(
          machinesApi.util.updateQueryData(
            'getMachine',
            machineId,
            (machine) => {
              machine.name = machineDetails.name
              machine.ownerId = machineDetails.ownerId
              machine.amountOfWorkers = machineDetails.amountOfWorkers
            }
          )
        )
        dispatch(
          machinesApi.util.updateQueryData(
            'getMachines',
            undefined,
            (machines) => {
              const machineIdx = machines.findIndex(
                (m) => m._id === machineDetails._id
              )
              if (machineDetails.ownerId === null)
                machines.splice(machineIdx, 1)
              else {
                machines[machineIdx].amountOfWorkers =
                  machineDetails.amountOfWorkers
                machines[machineIdx].name = machineDetails.name
              }
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log('error save, invalidating {Machines - machineId}', err)
          dispatch(
            machinesApi.util.invalidateTags([
              { type: 'Machines', id: machineId },
            ])
          )
        }
      },
    }),
    deleteMachine: builder.mutation({
      query: (machineId) => ({
        url: `/machines/${machineId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (res, err, machineId) => [
        { type: 'Machines', id: machineId },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useAddMachineMutation,
  useDeleteMachineMutation,
  useGetMachineQuery,
  useGetMachinesQuery,
  useSaveMachineMutation,
} = machinesApi

////////////////////////////////////////////////////////////////

// Define a type for the slice state
interface MachinesState {
  machines: MachineState[]
}

// Define the initial state using that type
const initialState: MachinesState = {
  machines: [],
} as MachinesState

export const MachinesSlice = createSlice({
  name: 'machines',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addMachine: (state, action: PayloadAction<MachineState>) => {
      const { _id, name, amountOfWorkers } = action.payload
      const machine = state.machines.find((m) => m._id === _id)
      if (machine) return
      state.machines.push(action.payload)
    },
    removeMachine: (state, action: PayloadAction<string>) => {
      const _id = action.payload
      const machineIdx = state.machines.findIndex((m) => m._id === _id)
      if (machineIdx < 0) return
      state.machines.splice(machineIdx, 1)
    },
    updateMachine: (state, action: PayloadAction<MachineState>) => {
      const { _id, name, amountOfWorkers } = action.payload
      const machine = state.machines.find((m) => m._id === _id)
      if (!machine) return
      machine.amountOfWorkers = amountOfWorkers
      machine.name = name
    },
  },
})

export const { addMachine, removeMachine, updateMachine } =
  MachinesSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectMachines = (state: RootState) => state.machines

export default MachinesSlice.reducer
