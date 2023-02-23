import React from 'react'
import { WorkerState } from '../types'
import { BasicWorkerItem } from './BasicWorkerItem'
import { WorkerItem } from './WorkerItem'

interface WorkerListProps {
  workers: {
    used: WorkerState[]
    unused: WorkerState[]
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
                <WorkerItem
                  key={`unused-morning-${worker._id}`}
                  isLocked={false}
                  worker={worker}
                  disableLock
                  disableRemove
                  enableFirstDropLock
                  disableDrop
                />
              ) : null
            )}
            {workers.used.map((worker) =>
              worker.shiftTime === 'morning' ? (
                <WorkerItem
                  key={`used-morning-${worker._id}`}
                  isLocked={true}
                  worker={worker}
                  disableLock
                  disableRemove
                  enableFirstDropLock
                  disableDrop
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
                <WorkerItem
                  key={`unused-evening-${worker._id}`}
                  isLocked={false}
                  worker={worker}
                  disableLock
                  disableRemove
                  enableFirstDropLock
                  disableDrop
                />
              ) : null
            )}
            {workers.used.map((worker) =>
              worker.shiftTime === 'evening' ? (
                <WorkerItem
                  key={`used-evening-${worker._id}`}
                  isLocked={true}
                  worker={worker}
                  disableLock
                  disableRemove
                  enableFirstDropLock
                  disableDrop
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
                <WorkerItem
                  key={`unused-night-${worker._id}`}
                  isLocked={false}
                  worker={worker}
                  disableLock
                  disableRemove
                  enableFirstDropLock
                  disableDrop
                />
              ) : null
            )}
            {workers.used.map((worker) =>
              worker.shiftTime === 'night' ? (
                <WorkerItem
                  key={`used-night-${worker._id}`}
                  isLocked={true}
                  worker={worker}
                  disableLock
                  disableRemove
                  enableFirstDropLock
                  disableDrop
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
                <WorkerItem
                  key={worker._id}
                  isLocked={false}
                  worker={worker}
                  disableLock
                  disableRemove
                  enableFirstDropLock
                  disableDrop
                />
              ) : null
            )}
            {workers.used.map((worker) =>
              !worker.shiftTime ? (
                <WorkerItem
                  key={worker._id}
                  isLocked={true}
                  worker={worker}
                  disableLock
                  disableRemove
                  enableFirstDropLock
                  disableDrop
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
