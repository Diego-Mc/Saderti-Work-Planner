import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

////////////////////////////////////////////////////////////////

import { apiSlice } from '../api/apiSlice'
import { StatisticsState } from '../../types'

export const statisticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query<StatisticsState, void>({
      queryFn: async (query, queryApi, extraOptions, baseQuery) => {
        const result = await baseQuery('/statistics/')
        const data = result.data as StatisticsState
        return { data }
      },
      providesTags: [{ type: 'Statistics' }],
    }),
  }),
  overrideExisting: false,
})

export const { useGetStatisticsQuery } = statisticsApi

////////////////////////////////////////////////////////////////
