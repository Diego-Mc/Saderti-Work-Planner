import React, { lazy, Suspense } from 'react'
import { NavLink, Route, Routes, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ListSkeletonLoader } from '../cmps/ListSkeletonLoader'
import { Loader } from '../cmps/Loader'
const MachineDashboard = lazy(() => import('../cmps/MachineDashboard'))
import {
  useAddMachineMutation,
  useGetMachinesQuery,
} from '../features/machines/machinesSlice'

interface MachinesManagementProps {}

export const MachinesManagement: React.FC<MachinesManagementProps> = ({}) => {
  const { data } = useGetMachinesQuery()
  const [addMachine] = useAddMachineMutation()

  const params = useParams()

  const isDashboardOpen = !!params.machineId

  const openAddMachineModal = async () => {
    const { value: machineName } = await Swal.fire({
      title: '🎉מכונה חדשה!🎉',
      input: 'text',
      inputLabel: 'מה שם המכונה?',
      inputPlaceholder: 'הכנס את שם המכונה',
      confirmButtonColor: '#545454',
    })

    if (machineName) addMachine(machineName)
  }

  return (
    <section
      className={`machines-management-view management-view ${
        isDashboardOpen ? 'open' : ''
      }`}>
      <section className="machines-list management-items-list">
        <div className="side-links">
          <button
            className="management-item-link add-btn"
            onClick={openAddMachineModal}>
            <span className="material-symbols-outlined">&#xe145;</span>
            הוסף מכונה
          </button>
          {data ? (
            data?.map((machine) => (
              <NavLink
                className="machine-link management-item-link"
                to={`/machines/${machine._id}`}
                key={machine._id}>
                {({ isActive }) => (
                  <>
                    <span
                      className={`material-symbols-outlined ${
                        isActive ? '' : 'outlined'
                      }`}>
                      &#xeb3f;
                    </span>
                    {machine.name}
                  </>
                )}
              </NavLink>
            ))
          ) : (
            <ListSkeletonLoader />
          )}
        </div>
      </section>
      <section className="machine-dashboard-wrapper dashboard-wrapper">
        {/* <Outlet /> */}
        <Suspense
          fallback={
            <>
              <section className="machine-dashboard-wrapper dashboard-wrapper" />
              <Loader />
            </>
          }>
          <Routes>
            <Route path=":machineId" element={<MachineDashboard />} />
          </Routes>
        </Suspense>
      </section>
    </section>
  )
}
export default MachinesManagement
