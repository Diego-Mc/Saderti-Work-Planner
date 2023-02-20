import React, { lazy, Suspense } from 'react'
import { NavLink, Route, Routes, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ListSkeletonLoader } from '../cmps/ListSkeletonLoader'
import { Loader } from '../cmps/Loader'
const WorkerDashboard = lazy(() => import('../cmps/WorkerDashboard'))
import {
  useAddWorkerMutation,
  useGetWorkersQuery,
} from '../features/workers/workersSlice'

interface WorkersManagementProps {}

export const WorkersManagement: React.FC<WorkersManagementProps> = ({}) => {
  const { data } = useGetWorkersQuery()
  const [addWorker] = useAddWorkerMutation()

  const params = useParams()

  const isDashboardOpen = !!params.workerId

  const openAddWorkerModal = async () => {
    const { value: workerName } = await Swal.fire({
      title: '🎉עובד חדש!🎉',
      input: 'text',
      inputLabel: 'איך קוראים לו?',
      inputPlaceholder: 'הכנס את שם העובד',
      confirmButtonColor: '#545454',
    })

    if (workerName) addWorker(workerName)
  }

  return (
    <section
      className={`workers-management-view management-view ${
        isDashboardOpen ? 'open' : ''
      }`}>
      <section className="workers-list management-items-list">
        <div className="side-links">
          <button
            className="management-item-link add-btn"
            onClick={openAddWorkerModal}>
            <span className="material-symbols-outlined">&#xe145;</span>
            הוסף עובד
          </button>
          {data ? (
            <>
              {data.map((worker) => (
                <NavLink
                  className="worker-link management-item-link"
                  to={`/workers/${worker._id}`}
                  key={worker._id}>
                  {({ isActive }) => (
                    <>
                      <span
                        className={`material-symbols-outlined ${
                          isActive ? '' : 'outlined'
                        }`}>
                        &#xe7fd;
                      </span>
                      {worker.name}
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
      <section className="worker-dashboard-wrapper dashboard-wrapper">
        {/* <Outlet /> */}
        <Suspense
          fallback={
            <>
              <section className="worker-dashboard-wrapper dashboard-wrapper" />
              <Loader />
            </>
          }>
          <Routes>
            <Route path=":workerId" element={<WorkerDashboard />} />
          </Routes>
        </Suspense>
      </section>
    </section>
  )
}
export default WorkersManagement
