import React from 'react'
import { VictoryPie } from 'victory'
import { StatisticsState, WorkerState } from '../../types'
import { CustomLabel } from './CustomLabel'

interface Props {
  statistics: StatisticsState
  worker: WorkerState
}

export const ChartWorkerTimes: React.FC<Props> = ({ statistics, worker }) => {
  const workerTimesStats: any = []

  ;['morning', 'evening', 'night'].forEach((time) => {
    const amountWorked =
      statistics.timeShiftsPerWorker?.[worker._id]?.[time]?.length || 0

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
      // padding={{ top: 50, right: 50, left: 50, bottom: 50 }}
      labels={({ datum }) =>
        datum._y > 0
          ? `:${
              datum.time === 'morning'
                ? 'בוקר'
                : datum.time === 'evening'
                ? 'ערב'
                : 'לילה'
            }\n ${datum.amountWorked}%`
          : ''
      }
      labelComponent={<CustomLabel />}
      data={workerTimesStats}
      x="time"
      y="amountWorked"
    />
  )
}
