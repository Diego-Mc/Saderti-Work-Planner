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
import { useWindowSize } from '../hooks/useWindowSize'

interface MachineDashboardProps {}

export const MachineDashboard: React.FC<MachineDashboardProps> = ({}) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: machine } = useGetMachineQuery(params.machineId as string)
  const { data: workers } = useGetWorkersQuery()
  const { data: statistics } = useGetStatisticsQuery()

  const [saveMachine] = useSaveMachineMutation()
  const [deleteMachine] = useDeleteMachineMutation()

  const statWrapper = useRef<HTMLDivElement>(null)

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

  const handleAmountOfWorkersChange = async () => {
    if (!machine) return
    const { value: amountOfWorkers } = await Swal.fire({
      title: 'לכמה עובדים המכונה מיועדת?',
      input: 'number',
      inputPlaceholder: 'הכנס את מספר העובדים',
      confirmButtonColor: '#545454',
    })

    if (amountOfWorkers) {
      saveMachine({
        machineDetails: { ...machine, amountOfWorkers: +amountOfWorkers },
        machineId: machine._id,
      })
      Swal.fire({
        title: 'השינוי בוצע בהצלחה!',
        text: `כמות העובדים העדכנית היא ${amountOfWorkers}`,
        confirmButtonColor: '#545454',
        icon: 'success',
      })
    }
  }

  const handleNameChange = async () => {
    if (!machine) return
    const { value: newName } = await Swal.fire({
      title: 'מה השם העדכני של המכונה?',
      text: 'השינוי ישתקף בכל הסידורים, גם בעתיד וגם בעבר!',
      input: 'text',
      inputPlaceholder: 'הכנס את שם המכונה העדכני',
      confirmButtonColor: '#545454',
    })

    if (newName) {
      saveMachine({
        machineDetails: { ...machine, name: newName },
        machineId: machine._id,
      })
      Swal.fire({
        title: 'השינוי בוצע בהצלחה!',
        text: `שם המכונה העדכני הוא ${newName}`,
        confirmButtonColor: '#545454',
        icon: 'success',
      })
    }
  }

  const handleDelete = async () => {
    if (!machine) return
    const { isConfirmed } = await Swal.fire({
      title: 'אתה בטוח?',
      text: 'המכונה לא תופיע בסידורים הבאים וגם לא בנתונים הסטטיסטיים - הסידורים הקודמים בהם הופיעה לא יושפעו.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3c82f6',
      cancelButtonColor: 'tomato',
      confirmButtonText: 'אני בטוח',
      cancelButtonText: 'ביטול',
    })

    if (isConfirmed) {
      saveMachine({
        machineDetails: { ...machine, ownerId: null },
        machineId: machine._id,
      })
      Swal.fire({
        title: 'המכונה נותקה בהצלחה',
        confirmButtonColor: '#545454',
        icon: 'success',
      })
      navigate('/machines')
    }
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
                onClick={handleAmountOfWorkersChange}>
                עדכון יעד עובדים
              </button>
              <button className="pill-btn" onClick={handleNameChange}>
                שינוי שם
              </button>
              <button className="pill-btn danger" onClick={handleDelete}>
                ניתוק
              </button>
            </div>
          </div>
          {machine.amountOfWorkers === 1 ? (
            <p className="header-sub-details">המכונה מיועדת לעובד אחד.</p>
          ) : (
            <p className="header-sub-details">
              המכונה מיועדת ל
              <span className="workers-amount-cta">
                {machine.amountOfWorkers}
              </span>{' '}
              עובדים.
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
              domainPadding={6}
              padding={{ top: 30, bottom: 30, left: 80, right: 60 }}
              width={(size?.width || 1200) - 600}
              height={workersAmountWorked.length * 20}>
              <VictoryBar
                theme={VictoryTheme.material}
                style={{
                  data: { fill: '#ffa600' },
                  labels: { fontFamily: 'Rubik', fontSize: 10 },
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
                    fontSize: 10,
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
