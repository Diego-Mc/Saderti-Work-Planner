import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useGetMachinesQuery } from '../features/machines/machinesSlice'
import { useGetStatisticsQuery } from '../features/statistics/statisticsSlice'
import {
  useGetWorkerQuery,
  useSaveWorkerMutation,
} from '../features/workers/workersSlice'
import { ChartWorkerMachineTimes } from './charts/ChartWorkerMachineTimes'
import { ChartWorkerPerMachine } from './charts/ChartWorkerPerMachine'
import { ChartWorkerTimes } from './charts/ChartWorkerTimes'

//TODO: remove "any" types...

interface WorkerDashboardProps {}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({}) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: worker } = useGetWorkerQuery(params.workerId as string)
  const { data: machines } = useGetMachinesQuery()
  const { data: statistics } = useGetStatisticsQuery()

  const [saveWorker] = useSaveWorkerMutation()

  //TODO: change - we need to iterate through all machines
  // if not found than put 0 in workAmount, also, this way we get the machine name

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
          <div className="header-details">
            <h2 className="title">
              <span
                className="material-symbols-outlined back-icon"
                onClick={() => navigate('/workers')}>
                &#xe5cc;
              </span>
              {worker.name}
            </h2>
            <div className="actions">
              <button className="pill-btn" onClick={handleNameChange}>
                שינוי שם
              </button>
              <button className="pill-btn danger" onClick={handleDelete}>
                ניתוק
              </button>
            </div>
          </div>

          <p className="header-sub-details">
            העובד/ת כרגע מיועד/ת למשמרת{' '}
            {worker.shiftTime === 'morning'
              ? 'בוקר'
              : worker.shiftTime === 'evening'
              ? 'ערב'
              : 'לילה'}
            .
          </p>
        </div>
      ) : null}

      {worker && statistics && machines ? (
        <div className="stat">
          <div className="main-stat">
            <h3 className="stat-title">
              סבבי עבודה בכל מכונה עם חלוקת זמן משמרת
            </h3>
            <div className="stat-wrapper">
              <ChartWorkerMachineTimes
                machines={machines}
                statistics={statistics}
                worker={worker}
              />
            </div>
          </div>

          <div className="sec-stat">
            <div className="worker-time-stat">
              <h3 className="stat-title">פילוח עבודה לפי זמן משמרת</h3>
              <div className="stat-graph">
                <ChartWorkerTimes statistics={statistics} worker={worker} />
              </div>
            </div>
            <div className="worker-machine-stat">
              <h3 className="stat-title">פילוח עבודה לפי מכונה</h3>
              <div className="stat-graph">
                <ChartWorkerPerMachine
                  machines={machines}
                  statistics={statistics}
                  worker={worker}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
export default WorkerDashboard
