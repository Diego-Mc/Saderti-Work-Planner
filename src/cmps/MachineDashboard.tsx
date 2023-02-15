import React from 'react'
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

interface MachineDashboardProps {}

export const MachineDashboard: React.FC<MachineDashboardProps> = ({}) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: machine } = useGetMachineQuery(params.machineId as string)
  const { data: workers } = useGetWorkersQuery()
  const { data: statistics } = useGetStatisticsQuery()

  const [saveMachine] = useSaveMachineMutation()
  const [deleteMachine] = useDeleteMachineMutation()

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
      (a: any, b: any) => b.amountWorked - a.amountWorked
    )
  }

  const handleAmountOfWorkersChange = async () => {
    if (!machine) return
    const { value: amountOfWorkers } = await Swal.fire({
      title: 'לכמה עובדים המכונה מיועדת?',
      input: 'number',
      // inputLabel: 'מה שם המכונה?',
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
        <>
          <h2 className="title">{machine.name}</h2>
          <p>
            המכונה מיועדת ל
            <span className="workers-amount-cta">
              {machine.amountOfWorkers}
            </span>{' '}
            עובדים
          </p>
          <div className="actions">
            <button className="pill-btn" onClick={handleAmountOfWorkersChange}>
              עדכון כמות עובדים
            </button>
            <button className="pill-btn" onClick={handleNameChange}>
              שינוי שם
            </button>
            <button className="pill-btn danger" onClick={handleDelete}>
              ניתוק
            </button>
          </div>
        </>
      ) : null}

      <div className="stat">
        <div className="main-stat">
          <VictoryChart domainPadding={20}>
            <VictoryBar
              theme={VictoryTheme.material}
              style={{ data: { fill: '#ffa600' } }}
              data={workersAmountWorked}
              x="worker"
              y="amountWorked"
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
            <VictoryAxis
              tickFormat={(y) => `${y}`}
              style={{
                tickLabels: {
                  angle: 45,
                  verticalAnchor: 'middle',
                  textAnchor: 'start',
                  padding: 10,
                  fontSize: 10,
                },
              }}
            />
          </VictoryChart>
        </div>
      </div>
    </section>
  )
}
