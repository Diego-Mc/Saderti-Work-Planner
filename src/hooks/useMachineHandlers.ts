import { MachineState } from './../types'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useSaveMachineMutation } from '../features/machines/machinesSlice'

export const useMachineHandlers = () => {
  const [saveMachine] = useSaveMachineMutation()
  const navigate = useNavigate()

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
      saveMachine({
        machineDetails: { ...machine, amountOfWorkers: +amountOfWorkers },
        machineId: machine._id,
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

  const handleImportanceChange = async (
    machine?: MachineState,
    showCompletedModal = true
  ) => {
    if (!machine) return
    const { value: importance } = await Swal.fire({
      title: 'מה חשיבות המכונה?',
      text: 'חשיבות המכונה היא דירוג מ0 ומעלה, מכונה שתדורג גבוה יותר תקבל איוש מדויק יותר.',
      input: 'number',
      inputPlaceholder: 'הכנס את חשיבות המכונה',
      confirmButtonColor: '#545454',
    })

    if (importance) {
      saveMachine({
        machineDetails: { ...machine, importance: +importance },
        machineId: machine._id,
      })
      if (showCompletedModal)
        Swal.fire({
          title: 'השינוי בוצע בהצלחה!',
          text: `חשיבות המכונה העדכנית היא ${importance}`,
          confirmButtonColor: '#545454',
          icon: 'success',
        })
    }

    return importance
  }

  const handleNameChange = async (
    machine?: MachineState,
    showCompletedModal = true
  ) => {
    if (!machine) return
    const { value: newName } = await Swal.fire({
      title: 'מה השם העדכני של המכונה?',
      text: 'השינוי ישתקף בכל הסידורים, גם בעתיד וגם בעבר!',
      input: 'text',
      inputPlaceholder: 'הכנס את שם המכונה העדכני',
      confirmButtonColor: '#545454',
    })

    if (newName) {
      saveMachine({
        machineDetails: { ...machine, name: newName },
        machineId: machine._id,
      })
      if (showCompletedModal)
        Swal.fire({
          title: 'השינוי בוצע בהצלחה!',
          text: `שם המכונה העדכני הוא ${newName}`,
          confirmButtonColor: '#545454',
          icon: 'success',
        })
    }

    return newName
  }

  const handleDelete = async (
    machine?: MachineState,
    showCompletedModal = true
  ) => {
    if (!machine) return
    const { isConfirmed } = await Swal.fire({
      title: 'אתה בטוח?',
      text: 'המכונה לא תופיע בסידורים הבאים וגם לא בנתונים הסטטיסטיים - הסידורים הקודמים בהם הופיעה לא יושפעו.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3c82f6',
      cancelButtonColor: 'tomato',
      confirmButtonText: 'אני בטוח',
      cancelButtonText: 'ביטול',
    })

    if (isConfirmed) {
      saveMachine({
        machineDetails: { ...machine, ownerId: null },
        machineId: machine._id,
      })
      if (showCompletedModal)
        Swal.fire({
          title: 'המכונה נותקה בהצלחה',
          confirmButtonColor: '#545454',
          icon: 'success',
        })
      navigate('/machines')
    }

    return isConfirmed
  }

  return {
    handleAmountOfWorkersChange: (machine: MachineState) =>
      handleAmountOfWorkersChange(machine),
    handleImportanceChange: (machine: MachineState) =>
      handleImportanceChange(machine),
    handleNameChange: (machine: MachineState) => handleNameChange(machine),
    handleDelete: (machine: MachineState) => handleDelete(machine),
  }
}
