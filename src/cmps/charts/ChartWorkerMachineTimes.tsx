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
      width={
        (size?.width || 1200) < 720 ? size.width : (size?.width || 1200) - 400
      }
      height={machines.length * 60}
      padding={{ top: 30, bottom: 50, left: 80, right: 60 }}
      domain={maxAmountWorked ? { y: [0, maxAmountWorked] } : {}}
      horizontal
      domainPadding={20}>
      <VictoryAxis
        style={{
          tickLabels: {
            fontFamily: 'Rubik',
            fontSize: 16,
          },
        }}
      />
      <VictoryAxis
        style={{
          tickLabels: {
            fontFamily: 'Rubik',
            fontSize: 16,
          },
        }}
        dependentAxis
        tickFormat={(x) => `${x}`}
      />
      <VictoryStack colorScale={['#edc949', '#f28e2c', '#af7aa1']}>
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
                fontSize: 16,
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
                fontSize: 16,
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
                fontSize: 16,
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
