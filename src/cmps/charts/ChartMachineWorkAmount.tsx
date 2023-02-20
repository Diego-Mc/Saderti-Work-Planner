import React from 'react'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory'
import { useWindowSize } from '../../hooks/useWindowSize'
import { MachineState, StatisticsState, WorkerState } from '../../types'

interface Props {
  statistics: StatisticsState
  workers: WorkerState[]
  machine: MachineState
}

export const ChartMachineWorkAmount: React.FC<Props> = ({
  statistics,
  workers,
  machine,
}) => {
  const size = useWindowSize()

  const workersAmountWorked: any = []

  if (statistics && workers && machine) {
    const machineWorkStats = statistics.amountWorkedPerMachine[machine._id]
    workers.forEach((w) => {
      workersAmountWorked.push({
        worker: w.name,
        amountWorked: machineWorkStats?.[w._id]?.length || 0,
      })
    })
    workersAmountWorked.sort(
      (a: any, b: any) => a.amountWorked - b.amountWorked
    )
  }

  return (
    <VictoryChart
      horizontal
      domainPadding={16}
      padding={{ top: 30, bottom: 30, left: 120, right: 60 }}
      width={
        (size?.width || 1200) < 720 ? size.width : (size?.width || 1200) - 400
      }
      height={workersAmountWorked.length * 80}>
      <VictoryBar
        theme={VictoryTheme.material}
        style={{
          data: { fill: '#ffa600' },
          labels: { fontFamily: 'Rubik', fontSize: 16 },
        }}
        data={workersAmountWorked}
        labels={({ datum }) =>
          datum.amountWorked ? `${datum.amountWorked}` : ''
        }
        x="worker"
        y="amountWorked"
      />
      <VictoryAxis
        tickFormat={(y) => `${y}`}
        style={{
          tickLabels: {
            // angle: 45,
            // verticalAnchor: 'middle',
            // textAnchor: 'start',
            padding: 10,
            fontSize: 16,
            fontFamily: 'Rubik',
          },
        }}
      />
    </VictoryChart>
  )
}
