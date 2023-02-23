import moment from 'moment'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetScheduleQuery } from '../features/schedules/schedulesSlice'
import { MachineScheduleTable } from './Table'
import { utilService } from '../services/util.service'
import { useScheduleHandlers } from '../hooks/useScheduleHandlers'
import { MachineHeaderCell } from './MachineHeaderCell'
import { Cell } from './Cell'

interface ScheduleDashboardProps {}

export const ScheduleDashboard: React.FC<ScheduleDashboardProps> = ({}) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: schedule } = useGetScheduleQuery(params.scheduleId as string)
  const { handleDelete, handleToExcel } = useScheduleHandlers()

  return (
    <section className="schedule-dashboard dashboard">
      {schedule ? (
        <>
          <div className="dashboard-header">
            <div className="header-details">
              <h2 className="title">
                <span
                  className="material-symbols-outlined back-icon"
                  onClick={() => navigate('/schedules')}>
                  &#xe5cc;
                </span>
                {utilService.formatDateRange(
                  schedule.date.from,
                  schedule.date.to
                )}
              </h2>

              <div className="actions">
                <Link to={`/edit/${schedule._id}`}>
                  <button className="pill-btn">עריכה</button>
                </Link>
                <button
                  className="pill-btn"
                  onClick={() => handleToExcel(schedule)}>
                  ייצוא לאקסל
                </button>
                <button className="pill-btn danger" onClick={handleDelete}>
                  מחיקה
                </button>
              </div>
            </div>
            <p className="header-sub-details">
              {`הסידור עודכן לאחרונה בתאריך ${moment(schedule.updatedAt).format(
                'DD/MM/YY'
              )} בשעה ${moment(schedule.updatedAt).format('HH:mm')}`}
            </p>
          </div>
          <div className="stat table-stat">
            <MachineScheduleTable headers={['מכונות', 'בוקר', 'ערב', 'לילה']}>
              {schedule.table.map((row) => (
                <div className="row" key={row.machine._id}>
                  {MachineHeaderCell ? <MachineHeaderCell row={row} /> : null}
                  <Cell
                    data={row.data.morning}
                    locked={row.locked.morning}
                    details={{
                      machineId: row.machine._id,
                      shiftTime: 'morning',
                    }}
                  />
                  <Cell
                    data={row.data.evening}
                    locked={row.locked.evening}
                    details={{
                      machineId: row.machine._id,
                      shiftTime: 'evening',
                    }}
                  />
                  <Cell
                    data={row.data.night}
                    locked={row.locked.night}
                    details={{
                      machineId: row.machine._id,
                      shiftTime: 'night',
                    }}
                  />
                </div>
              ))}
            </MachineScheduleTable>
          </div>
        </>
      ) : null}
    </section>
  )
}
export default ScheduleDashboard
