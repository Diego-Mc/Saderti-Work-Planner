import moment from 'moment'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useDeleteScheduleMutation,
  useGetScheduleQuery,
} from '../features/schedules/schedulesSlice'
import { Table } from './Table'
import ExcelJS from 'exceljs'
import { userService } from '../services/user.service'
import { downloadWorkbook, scheduleToExcel } from '../services/excel.service'
import Swal from 'sweetalert2'

interface ScheduleDashboardProps {}

export const ScheduleDashboard: React.FC<ScheduleDashboardProps> = ({}) => {
  const params = useParams()
  const navigate = useNavigate()
  const { data: schedule } = useGetScheduleQuery(params.scheduleId as string)

  const [deleteSchedule] = useDeleteScheduleMutation()

  const handleToExcel = () => {
    if (!schedule) return
    const workbook = scheduleToExcel(schedule)
    downloadWorkbook(workbook)
  }

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      title: 'אתה בטוח?',
      text: 'לא יהיה ניתן לשחזר את הסידור לאחר מכן.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3c82f6',
      cancelButtonColor: 'tomato',
      confirmButtonText: 'אני בטוח',
      cancelButtonText: 'ביטול',
    })

    if (isConfirmed) {
      deleteSchedule(params.scheduleId)
      Swal.fire({
        title: 'הסידור נמחק בהצלחה',
        confirmButtonColor: '#545454',
        icon: 'success',
      })
      navigate('/schedules')
    }
  }

  return (
    <section className="schedule-dashboard dashboard">
      {schedule ? (
        <>
          <h2 className="title">
            {moment(schedule.date.from).format('DD/mm')}-
            {moment(schedule.date.to).format('DD/mm/yyyy')}
          </h2>

          <div className="actions">
            <Link to={`/edit/${schedule._id}`}>
              <button className="pill-btn">עריכה</button>
            </Link>
            <button className="pill-btn" onClick={handleToExcel}>
              ייצוא
            </button>
            <button className="pill-btn danger" onClick={handleDelete}>
              מחיקה
            </button>
          </div>

          <Table table={schedule.table} />
        </>
      ) : null}
    </section>
  )
}
