import { ScheduleBase, MachineBase } from './../types'
export const postService = {
  getEmptySchedule,
  getEmptyMachine,
  getEmptyWorker,
}

function getEmptySchedule(): ScheduleBase {
  return {
    date: Date.now(),
    table: [],
  }
}

function getEmptyMachine(): MachineBase {
  return {
    name: '',
    amountOfWorkers: 1,
  }
}

function getEmptyWorker() {
  return {
    text: '',
    imgUrl: '',
    composerId: '',
  }
}
