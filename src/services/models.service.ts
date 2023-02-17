import { ScheduleBase, MachineBase } from './../types'
export const postService = {
  getEmptySchedule,
  getEmptyMachine,
  getEmptyWorker,
}

function getEmptySchedule(): ScheduleBase {
  return {
    date: {
      from: Date.now(),
      to: Date.now(),
    },
    ownerId: '',
    workers: {
      unused: [],
      used: [],
    },
    table: [],
  }
}

function getEmptyMachine(): MachineBase {
  return {
    name: '',
    amountOfWorkers: 1,
    importance: 1,
  }
}

function getEmptyWorker() {
  return {
    text: '',
    imgUrl: '',
    composerId: '',
  }
}
