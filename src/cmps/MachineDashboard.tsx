import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetMachineQuery } from '../features/machines/machinesSlice'
import { useGetStatisticsQuery } from '../features/statistics/statisticsSlice'
import { useGetWorkersQuery } from '../features/workers/workersSlice'
import { useMachineHandlers } from '../hooks/useMachineHandlers'
import { ChartMachineWorkAmount } from './charts/ChartMachineWorkAmount'

interface MachineDashboardProps {}

export const MachineDashboard: React.FC<MachineDashboardProps> = ({}) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: machine } = useGetMachineQuery(params.machineId as string)
  const { data: workers } = useGetWorkersQuery()
  const { data: statistics } = useGetStatisticsQuery()

  const {
    handleAmountOfWorkersChange,
    handleDelete,
    handleImportanceChange,
    handleNameChange,
  } = useMachineHandlers()

  return (
    <section className="machine-dashboard dashboard">
      {machine ? (
        <div className="dashboard-header">
          <div className="header-details">
            <h2 className="title">
              <span
                className="material-symbols-outlined back-icon"
                onClick={() => navigate('/machines')}>
                &#xe5cc;
              </span>
              {machine.name}
            </h2>
            <div className="actions">
              <button
                className="pill-btn"
                onClick={() => handleAmountOfWorkersChange(machine)}>
                יעד עובדים
              </button>
              <button
                className="pill-btn"
                onClick={() => handleImportanceChange(machine)}>
                חשיבות
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
            {machine && statistics && workers ? (
              <ChartMachineWorkAmount
                machine={machine}
                statistics={statistics}
                workers={workers}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
export default MachineDashboard
