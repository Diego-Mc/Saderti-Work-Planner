import { MachineState } from './../types'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useSaveMachineMutation } from '../features/machines/machinesSlice'
import {
  useChangeMachineWorkersAmountMutation,
  useDeleteScheduleMutation,
} from '../features/schedules/schedulesSlice'

export const useScheduleHandlers = () => {
  const [saveMachine] = useSaveMachineMutation()
  const navigate = useNavigate()
  const params = useParams()
  const [deleteSchedule] = useDeleteScheduleMutation()
  const [changeMachineWorkersAmount] = useChangeMachineWorkersAmountMutation()

  const handleAmountOfWorkersChange = async (
    machine?: MachineState,
    showCompletedModal = true
  ) => {
    if (!machine) return
    const { value: amountOfWorkers } = await Swal.fire({
      title: 'לכמה עובדים המכונה מיועדת?',
      input: 'number',
      inputPlaceholder: 'הכנס את מספר העובדים',
      confirmButtonColor: '#545454',
    })

    if (amountOfWorkers) {
      changeMachineWorkersAmount({
        scheduleId: params.scheduleId,
        changeDetails: { newAmount: +amountOfWorkers, machineId: machine._id },
      })
        .unwrap()
        .then(() => {
          saveMachine({
            machineDetails: { ...machine, amountOfWorkers: +amountOfWorkers },
            machineId: machine._id,
          }).unwrap()
        })

      if (showCompletedModal)
        Swal.fire({
          title: 'השינוי בוצע בהצלחה!',
          text: `כמות העובדים העדכנית היא ${amountOfWorkers}`,
          confirmButtonColor: '#545454',
          icon: 'success',
        })
    }

    return amountOfWorkers
  }

  const handleDelete = async (showCompletedModal = true) => {
    const { isConfirmed } = await Swal.fire({
      title: 'אתה בטוח?',
      text: 'לא יהיה ניתן לשחזר את הסידור לאחר מכן.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3c82f6',
      cancelButtonColor: 'tomato',
      confirmButtonText: 'אני בטוח',
      cancelButtonText: 'ביטול',
    })

    if (isConfirmed) {
      deleteSchedule(params.scheduleId)
      if (showCompletedModal)
        Swal.fire({
          title: 'הסידור נמחק בהצלחה',
          confirmButtonColor: '#545454',
          icon: 'success',
        })
      navigate('/schedules')
    }

    return isConfirmed
  }

  return {
    handleAmountOfWorkersChange: (machine: MachineState) =>
      handleAmountOfWorkersChange(machine),
    handleDelete: () => handleDelete(),
  }
}
