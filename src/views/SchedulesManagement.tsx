import moment from 'moment'
import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  useAddScheduleMutation,
  useGetSchedulesQuery,
} from '../features/schedules/schedulesSlice'

interface SchedulesManagementProps {}

export const SchedulesManagement: React.FC<SchedulesManagementProps> = ({}) => {
  const { data } = useGetSchedulesQuery()

  const navigate = useNavigate()

  return (
    <section className="schedules-management-view management-view">
      <section className="schedules-list management-items-list">
        <div className="side-links">
          <button
            className="management-item-link add-btn"
            onClick={() => navigate('/new')}>
            <span className="material-symbols-outlined">add</span>
            הוסף סידור
          </button>
          {data ? (
            <>
              {data.map((schedule) => (
                <NavLink
                  className="schedule-link management-item-link"
                  to={`/schedules/${schedule._id}`}
                  key={schedule._id}>
                  {({ isActive }) => (
                    <>
                      <span
                        className={`material-symbols-outlined ${
                          isActive ? '' : 'outlined'
                        }`}>
                        clinical_notes
                      </span>
                      {moment(schedule.date.from).format('DD/MM/yyyy')} -{' '}
                      {moment(schedule.date.to).format('DD/MM')}
                    </>
                  )}
                </NavLink>
              ))}
            </>
          ) : null}
        </div>
      </section>
      <section className="schedule-dashboard">
        <Outlet />
      </section>
    </section>
  )
}
