import React, { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  LineSegment,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory'
import {
  useDeleteMachineMutation,
  useGetMachineQuery,
  useSaveMachineMutation,
} from '../features/machines/machinesSlice'
import { useGetStatisticsQuery } from '../features/statistics/statisticsSlice'
import { useGetWorkersQuery } from '../features/workers/workersSlice'
import { useMachineHandlers } from '../hooks/useMachineHandlers'
import { useWindowSize } from '../hooks/useWindowSize'

interface MachineDashboardProps {}

export const MachineDashboard: React.FC<MachineDashboardProps> = ({}) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: machine } = useGetMachineQuery(params.machineId as string)
  const { data: workers } = useGetWorkersQuery()
  const { data: statistics } = useGetStatisticsQuery()

  const size = useWindowSize()

  const {
    handleAmountOfWorkersChange,
    handleDelete,
    handleImportanceChange,
    handleNameChange,
  } = useMachineHandlers()

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
    <section className="machine-dashboard dashboard">
      {machine ? (
        <div className="dashboard-header">
          <div className="header-details">
            <h2 className="title">{machine.name}</h2>
            <div className="actions">
              <button
                className="pill-btn"
                onClick={() => handleAmountOfWorkersChange(machine)}>
                עדכון יעד עובדים
              </button>
              <button
                className="pill-btn"
                onClick={() => handleImportanceChange(machine)}>
                עדכון חשיבות
              </button>
              <button
                className="pill-btn"
                onClick={() => handleNameChange(machine)}>
                שינוי שם
              </button>
              <button
                className="pill-btn danger"
                onClick={() => handleDelete(machine)}>
                ניתוק
              </button>
            </div>
          </div>
          {machine.amountOfWorkers === 1 ? (
            <p className="header-sub-details">
              המכונה מיועדת לעובד אחד ובעלת חשיבות {machine.importance}.
            </p>
          ) : (
            <p className="header-sub-details">
              המכונה מיועדת ל
              <span className="workers-amount-cta">
                {machine.amountOfWorkers}
              </span>{' '}
              עובדים ובעלת חשיבות {machine.importance}.
            </p>
          )}
        </div>
      ) : null}

      <div className="stat">
        <div className="main-stat">
          <h3 className="stat-title">כמות סבבי עבודה של כל עובד במכונה</h3>
          <div className="stat-wrapper">
            <VictoryChart
              horizontal
              domainPadding={16}
              padding={{ top: 30, bottom: 30, left: 120, right: 60 }}
              width={(size?.width || 1600) - 400}
              height={workersAmountWorked.length * 30}>
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
              {/* <VictoryAxis
                style={{
                  tickLabels: {
                    fontSize: 10,
                  },
                }}
                dependentAxis
                tickFormat={(x) => `${x}`}
              /> */}
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
          </div>
        </div>
      </div>
    </section>
  )
}
