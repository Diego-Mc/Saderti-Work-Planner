import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  useAddWorkerMutation,
  useGetWorkersQuery,
} from '../features/workers/workersSlice'

interface WorkersManagementProps {}

export const WorkersManagement: React.FC<WorkersManagementProps> = ({}) => {
  const { data } = useGetWorkersQuery()
  const [addWorker] = useAddWorkerMutation()

  const openAddWorkerModal = async () => {
    const { value: workerName } = await Swal.fire({
      title: '🎉עובד חדש!🎉',
      input: 'text',
      inputLabel: 'איך קוראים לו?',
      inputPlaceholder: 'הכנס את שם העובד',
      confirmButtonColor: '#545454',
    })

    addWorker(workerName)
  }

  return (
    <section className="workers-management-view">
      <section className="workers-list">
        <button className="btn outlined" onClick={openAddWorkerModal}>
          הוסף עובד חדש
        </button>
        {data ? (
          <>
            {data.map((worker) => (
              <NavLink
                className="worker-link"
                to={`/workers/${worker._id}`}
                key={worker._id}>
                {worker.name}
              </NavLink>
            ))}
          </>
        ) : null}
      </section>
      <section className="worker-dashboard">
        <Outlet />
      </section>
    </section>
  )
}
