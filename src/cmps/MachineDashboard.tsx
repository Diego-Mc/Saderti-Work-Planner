import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetMachineQuery } from '../features/machines/machinesSlice'

interface MachineDashboardProps {}

export const MachineDashboard: React.FC<MachineDashboardProps> = ({}) => {
  const params = useParams()
  const { data } = useGetMachineQuery(params.machineId as string)
  return (
    <section className="machine-dashboard">
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}
    </section>
  )
}
