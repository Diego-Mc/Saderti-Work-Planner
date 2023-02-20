import React, { lazy, Suspense } from 'react'
import {
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { ListSkeletonLoader } from '../cmps/ListSkeletonLoader'
import { Loader } from '../cmps/Loader'
const ScheduleDashboard = lazy(() => import('../cmps/ScheduleDashboard'))
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
            <span className="material-symbols-outlined">&#xe145;</span>
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
                        &#xe09e;
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
          ) : (
            <ListSkeletonLoader />
          )}
        </div>
      </section>
      <section className="schedule-dashboard-wrapper dashboard-wrapper">
        {/* <Outlet /> */}
        <Suspense
          fallback={
            <>
              <section className="schedule-dashboard-wrapper dashboard-wrapper" />
              <Loader />
            </>
          }>
          <Routes>
            <Route path=":scheduleId" element={<ScheduleDashboard />} />
          </Routes>
        </Suspense>
      </section>
    </section>
  )
}
export default SchedulesManagement
