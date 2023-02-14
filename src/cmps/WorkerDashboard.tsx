import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetStatisticsQuery } from '../features/statistics/statisticsSlice'
import { useGetWorkerQuery } from '../features/workers/workersSlice'

interface WorkerDashboardProps {}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({}) => {
  const params = useParams()
  const { data: worker } = useGetWorkerQuery(params.workerId as string)
  const { data: statistics } = useGetStatisticsQuery()

  return (
    <section className="worker-dashboard">
      {worker ? <pre>{JSON.stringify(worker, null, 2)}</pre> : null}
      {statistics ? <pre>{JSON.stringify(statistics, null, 2)}</pre> : null}
    </section>
  )
}
