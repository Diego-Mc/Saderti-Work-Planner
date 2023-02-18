import React from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
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
            <span className="material-symbols-outlined">add</span>
            הוסף מכונה
          </button>
          {data
            ? data.map((machine) => (
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
                        business_center
                      </span>
                      {machine.name}
                    </>
                  )}
                </NavLink>
              ))
            : null}
        </div>
      </section>
      <section className="machine-dashboard">
        <Outlet />
      </section>
    </section>
  )
}
