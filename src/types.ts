export type WorkerIdentifier = {
  machineId: string
  shiftTime: string
  idx: number
}

export type WorkerType = {
  name: string
  _id: string
}

export type TableRow = {
  machine: {
    name: string
    _id: string
    workersAmount: number
  }
  data: {
    [key: string]: (WorkerType | null)[]
    morning: (WorkerType | null)[]
    evening: (WorkerType | null)[]
    night: (WorkerType | null)[]
  }
  locked: {
    [key: string]: boolean[]
    morning: boolean[]
    evening: boolean[]
    night: boolean[]
  }
}

export type BaseTableRow = {
  //before backend population
  machine: string
  data: {
    [key: string]: (WorkerType | null)[]
    morning: (WorkerType | null)[]
    evening: (WorkerType | null)[]
    night: (WorkerType | null)[]
  }
  locked: {
    [key: string]: boolean[]
    morning: boolean[]
    evening: boolean[]
    night: boolean[]
  }
}

export type ScheduleWorker = {
  _id: string
  name: string
  shiftTime: string
}

export interface ScheduleState extends Omit<ScheduleBase, 'workers'> {
  _id: string
  workers: {
    used: ScheduleWorker[]
    unused: ScheduleWorker[]
  }
}

export type ScheduleBase = {
  ownerId: string
  date: number
  table: TableRow[]
  workers: {
    used: string[]
    unused: string[]
  }
}

export interface MachineState extends MachineBase {
  _id: string
}

export type MachineBase = {
  ownerId: string
  name: string
  amountOfWorkers: number
}

export type sessionUser = {
  username: string
  _id: string
}

export interface WorkerState extends WorkerBase {
  _id: string
}

export type WorkerBase = {
  ownerId: string
  name: string
  shiftTime: string
}
