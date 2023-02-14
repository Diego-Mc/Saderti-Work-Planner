import moment from 'moment'
import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  useAddScheduleMutation,
  useGetSchedulesQuery,
} from '../features/schedules/schedulesSlice'

interface SchedulesManagementProps {}

export const SchedulesManagement: React.FC<SchedulesManagementProps> = ({}) => {
  const { data } = useGetSchedulesQuery()

  const openAddScheduleModal = async () => {}

  return (
    <section className="schedules-management-view management-view">
      <section className="schedules-list management-items-list">
        <Link to="/new">
          <button className="btn outlined" onClick={openAddScheduleModal}>
            הוסף סידור חדש
          </button>
        </Link>
        {data ? (
          <>
            {data.map((schedule) => (
              <NavLink
                className="schedule-link management-item-link"
                to={`/schedules/${schedule._id}`}
                key={schedule._id}>
                {moment(schedule.date.from).format('DD/MM/yyyy')} -{' '}
                {moment(schedule.date.to).format('DD/MM')}
              </NavLink>
            ))}
          </>
        ) : null}
      </section>
      <section className="schedule-dashboard">
        <Outlet />
      </section>
    </section>
  )
}
