import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryPie,
  VictoryStack,
  VictoryTooltip,
} from 'victory'
import { useGetMachinesQuery } from '../features/machines/machinesSlice'
import { useGetStatisticsQuery } from '../features/statistics/statisticsSlice'
import {
  useGetWorkerQuery,
  useSaveWorkerMutation,
} from '../features/workers/workersSlice'
import { StatisticsState } from '../types'

//TODO: remove "any" types...

const CustomLabel = (props: any) => (
  <g>
    <VictoryLabel {...props} />
    <VictoryTooltip
      {...props}
      style={{
        labels: { opacity: 1 },
        fill: 'white',
        fontWeight: 700,
        fontFamily: 'Arimo',
        fontSize: 20,
      }}
      x={200}
      y={250}
      orientation="top"
      pointerLength={0}
      cornerRadius={50}
      flyoutWidth={100}
      flyoutHeight={100}
      flyoutStyle={{ fill: 'black' }}
    />
  </g>
)

CustomLabel.defaultEvents = VictoryTooltip.defaultEvents

interface WorkerDashboardProps {}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({}) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: worker } = useGetWorkerQuery(params.workerId as string)
  const { data: machines } = useGetMachinesQuery()
  const { data: statistics } = useGetStatisticsQuery()

  const [saveWorker] = useSaveWorkerMutation()

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
      machineTimesStats[time].sort((a: any, b: any) =>
        a.machine.localeCompare(b.machine)
      )
    })
  }

  const handleNameChange = async () => {
    if (!worker) return
    const { value: newName } = await Swal.fire({
      title: 'מה השם העדכני של העובד?',
      text: 'השינוי ישתקף בכל הסידורים, גם בעתיד וגם בעבר!',
      input: 'text',
      inputPlaceholder: 'הכנס את שם העובד העדכני',
      confirmButtonColor: '#545454',
    })

    if (newName) {
      saveWorker({
        workerDetails: { ...worker, name: newName },
        workerId: worker._id,
      })
      Swal.fire({
        title: 'השינוי בוצע בהצלחה!',
        text: `שם העובד העדכני הוא ${newName}`,
        confirmButtonColor: '#545454',
        icon: 'success',
      })
    }
  }

  const handleDelete = async () => {
    if (!worker) return
    const { isConfirmed } = await Swal.fire({
      title: 'אתה בטוח?',
      text: 'העובד לא יופיע בסידורים הבאים וגם לא בנתונים הסטטיסטיים - הסידורים הקודמים בהם הופיע לא יושפעו.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3c82f6',
      cancelButtonColor: 'tomato',
      confirmButtonText: 'אני בטוח',
      cancelButtonText: 'ביטול',
    })

    if (isConfirmed) {
      saveWorker({
        workerDetails: { ...worker, ownerId: null },
        workerId: worker._id,
      })
      Swal.fire({
        title: 'העובד נותק בהצלחה',
        confirmButtonColor: '#545454',
        icon: 'success',
      })
      navigate('/workers')
    }
  }

  return (
    <section className="worker-dashboard dashboard">
      {worker ? (
        <div className="dashboard-header">
          <h2 className="title">{worker.name}</h2>
          <div className="actions">
            <button className="pill-btn" onClick={handleNameChange}>
              עדכון שם
            </button>
            <button className="pill-btn danger" onClick={handleDelete}>
              מחיקה
            </button>
          </div>
        </div>
      ) : null}

      {worker && statistics ? (
        <div className="stat">
          <div className="main-stat">
            <h3 className="stat-title">
              סבבי עבודה בכל מכונה בפילוג לפי זמן משמרת
            </h3>
            <VictoryChart
              padding={{ top: 30, left: 50, right: 50, bottom: 50 }}
              domainPadding={20}>
              <VictoryAxis
                style={{
                  tickLabels: {
                    fontSize: 10,
                  },
                }}
              />
              <VictoryAxis
                style={{
                  tickLabels: {
                    fontSize: 10,
                  },
                }}
                dependentAxis
                tickFormat={(x) => `${x}`}
              />
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
                  labels={({ datum }) =>
                    datum._y > 0 ? `ערב: ${datum._y}` : ''
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
          </div>

          <div className="sec-stat">
            <div className="worker-time-stat">
              <h3 className="stat-title">פילוח עבודה לפי זמן משמרת</h3>
              <div className="stat-graph">
                <VictoryPie
                  style={{ labels: { opacity: 1, fontWeight: 700 } }}
                  colorScale={['#ffa600', '#a05195', '#003f5c']}
                  innerRadius={100}
                  labelRadius={120}
                  // padding={{ top: 50, right: 50, left: 50, bottom: 50 }}
                  labels={({ datum }) =>
                    datum._y > 0
                      ? `${
                          datum.time === 'morning'
                            ? 'בוקר'
                            : datum.time === 'evening'
                            ? 'ערב'
                            : 'לילה'
                        }`
                      : ''
                  }
                  labelComponent={<CustomLabel />}
                  data={workerTimesStats}
                  x="time"
                  y="amountWorked"
                />
              </div>
            </div>
            <div className="worker-machine-stat">
              <h3 className="stat-title">פילוח עבודה לפי מכונה</h3>
              <div className="stat-graph">
                <VictoryPie
                  style={{ labels: { opacity: 1, fontWeight: 700 } }}
                  colorScale={['#ffa600', '#a05195', '#003f5c']}
                  innerRadius={100}
                  labelRadius={120}
                  labels={({ datum }) =>
                    datum._y > 0 ? `${datum.machine}` : ''
                  }
                  labelComponent={<CustomLabel />}
                  data={workedInMachineStats}
                  x="machine"
                  y="amountWorked"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
