import React from 'react'
import { Worker } from '../main'

interface WorkerListProps {
  workers: Worker[]
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>
}

export const WorkerList: React.FC<WorkerListProps> = ({
  workers,
  setWorkers,
}) => {
  return (
    <div className="worker-list">
      <h2 className="worker-list-title">שיוכים מקוריים</h2>
      <div className="morning-list">
        <h3 className="list-section-title">בוקר</h3>
        {workers.map((worker) =>
          worker.currTimeShift === 'morning' ? (
            <article
              className={`worker-item ${worker ? '' : 'empty'}`}
              key={worker.name}>
              {worker.name}
            </article>
          ) : null
        )}
      </div>
      <div className="evening-list">
        <h3 className="list-section-title">ערב</h3>
        {workers.map((worker) =>
          worker.currTimeShift === 'evening' ? (
            <article
              className={`worker-item ${worker ? '' : 'empty'}`}
              key={worker.name}>
              {worker.name}
            </article>
          ) : null
        )}
      </div>
      <div className="night-list">
        <h3 className="list-section-title">לילה</h3>
        {workers.map((worker) =>
          worker.currTimeShift === 'night' ? (
            <article
              className={`worker-item ${worker ? '' : 'empty'}`}
              key={worker.name}>
              {worker.name}
            </article>
          ) : null
        )}
      </div>
      <div className="night-list">
        <h3 className="list-section-title">ללא שיוך</h3>
        {workers.map((worker) =>
          worker.currTimeShift === undefined ? (
            <article
              className={`worker-item ${worker ? '' : 'empty'}`}
              key={worker.name}>
              {worker.name}
            </article>
          ) : null
        )}
      </div>
    </div>
  )
}
