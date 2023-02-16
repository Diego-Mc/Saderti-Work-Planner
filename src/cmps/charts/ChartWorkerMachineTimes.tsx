import React from 'react'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryTooltip,
} from 'victory'
import { useWindowSize } from '../../hooks/useWindowSize'
import { MachineState, StatisticsState, WorkerState } from '../../types'

interface Props {
  worker: WorkerState
  machines: MachineState[]
  statistics: StatisticsState
}

export const ChartWorkerMachineTimes: React.FC<Props> = ({
  worker,
  machines,
  statistics,
}) => {
  const size = useWindowSize()

  const machineTimesStats: any = {
    morning: [],
    evening: [],
    night: [],
  }

  let maxAmountWorked = 0

  const machineTimes: StatisticsState['machineTimeShiftsPerWorker'] =
    statistics.machineTimeShiftsPerWorker

  Object.keys(machineTimesStats).forEach((time) => {
    machines.forEach((m) => {
      machineTimesStats[time].push({
        machine: m.name,
        amountWorked: machineTimes?.[worker._id]?.[time]?.[m._id]?.length || 0,
      })
    })
    machineTimesStats[time].sort((a: any, b: any) =>
      a.machine.localeCompare(b.machine)
    )
  })

  for (let i = 0; i < machineTimesStats.morning.length; i++) {
    const sumWorked =
      machineTimesStats.morning[i].amountWorked +
      machineTimesStats.evening[i].amountWorked +
      machineTimesStats.night[i].amountWorked
    if (maxAmountWorked < sumWorked) maxAmountWorked = sumWorked
  }

  return (
    <VictoryChart
      width={(size?.width || 1600) - 800}
      padding={{ top: 30, left: 50, right: 50, bottom: 50 }}
      domain={maxAmountWorked ? { y: [0, maxAmountWorked] } : {}}
      domainPadding={20}>
      <VictoryAxis
        style={{
          tickLabels: {
            fontSize: 10,
            fontFamily: 'Rubik',
          },
        }}
      />
      <VictoryAxis
        tickCount={maxAmountWorked + 1}
        style={{
          tickLabels: {
            fontSize: 10,
            fontFamily: 'Rubik',
          },
        }}
        dependentAxis
        tickFormat={(x) => `${x}`}
      />
      <VictoryStack colorScale={['#ffa600', '#a05195', '#003f5c']}>
        <VictoryBar
          data={machineTimesStats.morning}
          labels={({ datum }) => (datum._y > 0 ? `בוקר: ${datum._y}` : '')}
          labelComponent={
            <VictoryTooltip
              pointerLength={0}
              cornerRadius={0}
              centerOffset={{ y: 10 }}
              orientation="bottom"
              flyoutStyle={{ fill: 'black', stroke: 'black' }}
              style={{
                fontFamily: 'Rubik',
                fontSize: 10,
                fill: 'white',
                fontWeight: 700,
              }}
            />
          }
          x="machine"
          y="amountWorked"
        />
        <VictoryBar
          data={machineTimesStats.evening}
          labels={({ datum }) => (datum._y > 0 ? `ערב: ${datum._y}` : '')}
          labelComponent={
            <VictoryTooltip
              pointerLength={0}
              cornerRadius={0}
              centerOffset={{ y: 10 }}
              orientation="bottom"
              flyoutStyle={{ fill: 'black', stroke: 'black' }}
              style={{
                fontFamily: 'Rubik',
                fontSize: 10,
                fill: 'white',
                fontWeight: 700,
              }}
            />
          }
          x="machine"
          y="amountWorked"
        />
        <VictoryBar
          data={machineTimesStats.night}
          labels={({ datum }) => (datum._y > 0 ? `לילה: ${datum._y}` : '')}
          labelComponent={
            <VictoryTooltip
              pointerLength={0}
              cornerRadius={0}
              centerOffset={{ y: 10 }}
              orientation="bottom"
              flyoutStyle={{ fill: 'black', stroke: 'black' }}
              style={{
                fontFamily: 'Rubik',
                fontSize: 10,
                fill: 'white',
                fontWeight: 700,
              }}
            />
          }
          x="machine"
          y="amountWorked"
        />
      </VictoryStack>
    </VictoryChart>
  )
}
