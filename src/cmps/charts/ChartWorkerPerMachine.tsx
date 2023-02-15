import React from 'react'
import { VictoryPie } from 'victory'
import { MachineState, StatisticsState, WorkerState } from '../../types'
import { CustomLabel } from './CustomLabel'

interface Props {
  worker: WorkerState
  machines: MachineState[]
  statistics: StatisticsState
}

export const ChartWorkerPerMachine: React.FC<Props> = ({
  worker,
  machines,
  statistics,
}) => {
  const workedInMachineStats: any[] = []

  const amountWorked = statistics.amountWorkedInMachinePerWorker?.[worker._id]
  machines.forEach((m: any) => {
    workedInMachineStats.push({
      machine: m.name,
      amountWorked: amountWorked?.[m._id]?.length || 0,
    })
  })

  const total = workedInMachineStats.reduce(
    (a: any, b: any) => a + b.amountWorked,
    0
  )
  workedInMachineStats.forEach(
    (stat: any) =>
      (stat.amountWorked = Math.round((stat.amountWorked / total) * 100))
  )

  return (
    <VictoryPie
      style={{
        labels: {
          opacity: 1,
          fontWeight: 700,
          fontFamily: 'Rubik',
          userSelect: 'none',
        },
      }}
      colorScale={['#ffa600', '#a05195', '#003f5c']}
      innerRadius={100}
      labelRadius={120}
      labels={({ datum }) =>
        datum._y > 0 ? `:${datum.machine}\n ${datum.amountWorked}%` : ''
      }
      labelComponent={<CustomLabel />}
      data={workedInMachineStats}
      x="machine"
      y="amountWorked"
    />
  )
}
