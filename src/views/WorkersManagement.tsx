import React from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
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
            <span className="material-symbols-outlined">add</span>
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
                        person
                      </span>
                      {worker.name}
                    </>
                  )}
                </NavLink>
              ))}
            </>
          ) : null}
        </div>
      </section>
      <section className="worker-dashboard-wrapper dashboard-wrapper">
        <Outlet />
      </section>
    </section>
  )
}
