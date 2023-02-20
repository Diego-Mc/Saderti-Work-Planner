import React from 'react'
import { ScheduleWorker } from '../types';
import { BasicWorkerItem } from './BasicWorkerItem'

interface WorkerListProps {
  workers: {
    used: ScheduleWorker[]
    unused: ScheduleWorker[]
  }
}

export const WorkerList: React.FC<WorkerListProps> = ({ workers }) => {
  return (
    <div className="worker-list">
      <h2 className="worker-list-title">שיוכים מקוריים</h2>
      <div className="time-shifts-lists">
        <div className="morning-list">
          <h3 className="list-section-title">בוקר</h3>
          <div className="list-section-list">
            {workers.unused.map((worker) =>
              worker.shiftTime === 'morning' ? (
                <BasicWorkerItem
                  isUsed={false}
                  worker={worker}
                  key={worker._id}
                />
              ) : null
            )}
            {workers.used.map((worker) =>
              worker.shiftTime === 'morning' ? (
                <BasicWorkerItem
                  isUsed={true}
                  worker={worker}
                  key={worker._id}
                />
              ) : null
            )}
          </div>
        </div>
        <div className="evening-list">
          <h3 className="list-section-title">ערב</h3>
          <div className="list-section-list">
            {workers.unused.map((worker) =>
              worker.shiftTime === 'evening' ? (
                <BasicWorkerItem
                  isUsed={false}
                  worker={worker}
                  key={worker._id}
                />
              ) : null
            )}
            {workers.used.map((worker) =>
              worker.shiftTime === 'evening' ? (
                <BasicWorkerItem
                  isUsed={true}
                  worker={worker}
                  key={worker._id}
                />
              ) : null
            )}
          </div>
        </div>
        <div className="night-list">
          <h3 className="list-section-title">לילה</h3>
          <div className="list-section-list">
            {workers.unused.map((worker) =>
              worker.shiftTime === 'night' ? (
                <BasicWorkerItem
                  isUsed={false}
                  worker={worker}
                  key={worker._id}
                />
              ) : null
            )}
            {workers.used.map((worker) =>
              worker.shiftTime === 'night' ? (
                <BasicWorkerItem
                  isUsed={true}
                  worker={worker}
                  key={worker._id}
                />
              ) : null
            )}
          </div>
        </div>
        <div className="night-list">
          <h3 className="list-section-title">ללא שיוך</h3>
          <div className="list-section-list">
            {workers.unused.map((worker) =>
              !worker.shiftTime ? (
                <BasicWorkerItem
                  isUsed={false}
                  worker={worker}
                  key={worker._id}
                />
              ) : null
            )}
            {workers.used.map((worker) =>
              !worker.shiftTime ? (
                <BasicWorkerItem
                  isUsed={true}
                  worker={worker}
                  key={worker._id}
                />
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default WorkerList
