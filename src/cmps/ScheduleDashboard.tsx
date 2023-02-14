import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetScheduleQuery } from '../features/schedules/schedulesSlice'
import { Table } from './Table'

interface ScheduleDashboardProps {}

export const ScheduleDashboard: React.FC<ScheduleDashboardProps> = ({}) => {
  const params = useParams()
  const { data: schedule } = useGetScheduleQuery(params.scheduleId as string)
  return (
    <section className="schedule-dashboard">
      {schedule ? <Table table={schedule.table} /> : null}
    </section>
  )
}
