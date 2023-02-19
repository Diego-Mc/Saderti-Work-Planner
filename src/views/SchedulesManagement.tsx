import React from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useGetSchedulesQuery } from '../features/schedules/schedulesSlice'
import { utilService } from '../services/util.service'

interface SchedulesManagementProps {}

export const SchedulesManagement: React.FC<SchedulesManagementProps> = ({}) => {
  const { data } = useGetSchedulesQuery()

  const params = useParams()

  const navigate = useNavigate()

  const isDashboardOpen = !!params.scheduleId

  return (
    <section
      className={`schedules-management-view management-view ${
        isDashboardOpen ? 'open' : ''
      }`}>
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

                      {utilService.formatDateRange(
                        schedule.date.from,
                        schedule.date.to
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </>
          ) : null}
        </div>
      </section>
      <section className="schedule-dashboard-wrapper dashboard-wrapper">
        <Outlet />
      </section>
    </section>
  )
}
