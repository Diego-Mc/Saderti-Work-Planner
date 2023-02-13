import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  useAddMachineMutation,
  useGetMachinesQuery,
} from '../features/machines/machinesSlice'

interface MachinesManagementProps {}

export const MachinesManagement: React.FC<MachinesManagementProps> = ({}) => {
  const { data } = useGetMachinesQuery()
  const [addMachine] = useAddMachineMutation()

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
    <section className="machines-management-view management-view">
      <section className="machines-list management-items-list">
        <button className="btn outlined" onClick={openAddMachineModal}>
          הוסף מכונה חדשה
        </button>
        {data ? (
          <>
            {data.map((machine) => (
              <NavLink
                className="machine-link management-item-link"
                to={`/machines/${machine._id}`}
                key={machine._id}>
                {machine.name}
              </NavLink>
            ))}
          </>
        ) : null}
      </section>
      <section className="machine-dashboard">
        <Outlet />
      </section>
    </section>
  )
}
