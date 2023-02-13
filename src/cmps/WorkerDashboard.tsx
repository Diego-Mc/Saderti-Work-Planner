import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetWorkerQuery } from '../features/workers/workersSlice'

interface WorkerDashboardProps {}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({}) => {
  const params = useParams()
  const { data } = useGetWorkerQuery(params.workerId as string)
  return (
    <section className="worker-dashboard">
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}
    </section>
  )
}
