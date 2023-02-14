import React from 'react'
import { useParams } from 'react-router-dom'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryPie,
  VictoryStack,
  VictoryTheme,
  VictoryTooltip,
} from 'victory'
import { useGetMachinesQuery } from '../features/machines/machinesSlice'
import { useGetStatisticsQuery } from '../features/statistics/statisticsSlice'
import { useGetWorkerQuery } from '../features/workers/workersSlice'
import { StatisticsState } from '../types'

//TODO: remove "any" types...

interface WorkerDashboardProps {}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({}) => {
  const params = useParams()
  const { data: worker } = useGetWorkerQuery(params.workerId as string)
  const { data: machines } = useGetMachinesQuery()
  const { data: statistics } = useGetStatisticsQuery()

  const machineTimesStats: any = {
    morning: [],
    evening: [],
    night: [],
  }

  const workerTimesStats: any = []

  const workedInMachineStats: any[] = []

  if (worker && machines && statistics) {
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
  }

  if (worker && statistics) {
    Object.keys(machineTimesStats).forEach((time) => {
      const amountWorked =
        statistics.timeShiftsPerWorker?.[worker._id][time]?.length || 0

      workerTimesStats.push({ time, amountWorked })
    })
    const total = workerTimesStats.reduce(
      (a: any, b: any) => a + b.amountWorked,
      0
    )
    workerTimesStats.forEach(
      (stat: any) =>
        (stat.amountWorked = Math.round((stat.amountWorked / total) * 100))
    )
  }

  //TODO: change - we need to iterate through all machines
  // if not found than put 0 in workAmount, also, this way we get the machine name
  if (statistics?.machineTimeShiftsPerWorker && worker && machines) {
    const machineTimes: StatisticsState['machineTimeShiftsPerWorker'] =
      statistics.machineTimeShiftsPerWorker
    Object.keys(machineTimesStats).forEach((time) => {
      machines.forEach((m) => {
        machineTimesStats[time].push({
          machine: m.name,
          amountWorked:
            machineTimes?.[worker._id]?.[time]?.[m._id]?.length || 0,
        })
      })
    })
  }

  console.log(machineTimesStats)

  return (
    <section className="worker-dashboard dashboard">
      {worker ? <pre>{JSON.stringify(worker, null, 2)}</pre> : null}
      {/* {statistics ? <pre>{JSON.stringify(statistics, null, 2)}</pre> : null} */}
      {worker && statistics ? (
        <div className="stat">
          <VictoryChart domainPadding={20}>
            <VictoryAxis
              tickValues={machineTimesStats.morning.map(
                (obj: any) => obj.amountWorked
              )}
              tickFormat={machineTimesStats.morning.map(
                (obj: any) => obj.machine
              )}
            />
            <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
            <VictoryStack colorScale={['#ffa600', '#a05195', '#003f5c']}>
              <VictoryBar
                data={machineTimesStats.morning}
                labels={({ datum }) =>
                  datum._y > 0 ? `בוקר: ${datum._y}` : ''
                }
                labelComponent={
                  <VictoryTooltip
                    pointerLength={0}
                    cornerRadius={0}
                    centerOffset={{ y: 10 }}
                    orientation="bottom"
                    style={{ fontFamily: 'Arimo' }}
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
                    style={{ fontFamily: 'Arimo' }}
                  />
                }
                x="machine"
                y="amountWorked"
              />
              <VictoryBar
                data={machineTimesStats.night}
                labels={({ datum }) =>
                  datum._y > 0 ? `לילה: ${datum._y}` : ''
                }
                labelComponent={
                  <VictoryTooltip
                    pointerLength={0}
                    cornerRadius={0}
                    centerOffset={{ y: 10 }}
                    orientation="bottom"
                    style={{ fontFamily: 'Arimo' }}
                  />
                }
                x="machine"
                y="amountWorked"
              />
            </VictoryStack>
          </VictoryChart>

          <VictoryPie
            data={workerTimesStats}
            colorScale={['#ffa600', '#a05195', '#003f5c']}
            x="time"
            y="amountWorked"
            labels={({ datum }) =>
              datum._y > 0
                ? `${
                    datum.time === 'morning'
                      ? 'בוקר'
                      : datum.time === 'evening'
                      ? 'ערב'
                      : 'לילה'
                  }: ${datum._y}%`
                : ''
            }
            labelComponent={<VictoryLabel style={{ fontFamily: 'Arimo' }} />}
          />

          <VictoryPie
            data={workedInMachineStats}
            x="machine"
            y="amountWorked"
            labels={({ datum }) =>
              datum._y > 0 ? `${datum.machine}: ${datum._y}%` : ''
            }
            labelComponent={<VictoryLabel style={{ fontFamily: 'Arimo' }} />}
          />
        </div>
      ) : null}
    </section>
  )
}
