import moment from 'moment'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useDeleteScheduleMutation,
  useGetScheduleQuery,
} from '../features/schedules/schedulesSlice'
import { Table } from './Table'
import { downloadWorkbook, scheduleToExcel } from '../services/excel.service'
import Swal from 'sweetalert2'
import { utilService } from '../services/util.service'
import { useScheduleHandlers } from '../hooks/useScheduleHandlers'

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
                  chevron_right
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
            <Table table={schedule.table} />
          </div>
        </>
      ) : null}
    </section>
  )
}
