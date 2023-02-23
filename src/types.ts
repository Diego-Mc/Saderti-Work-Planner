import { ItemTypes } from './constants'

export type WorkerIdentifier = {
  machineId: string
  shiftTime: string
  idx: number
  name?: string
}

// export type WorkerType = {
//   name: string
//   shiftTime: string
//   _id: string
// }

// type of item passed to cell for schedule...
export type WorkerItemType = {
  details: WorkerIdentifier | WorkerState
  type: typeof ItemTypes[keyof typeof ItemTypes]
}

export interface WorkerState extends WorkerBase {
  _id: string
}

export type WorkerBase = {
  ownerId: string
  name: string
  shiftTime: string
}

export type TableRow = {
  machine: {
    name: string
    _id: string
    amountOfWorkers: number
    importance: number
  }
  data: {
    [key: string]: (WorkerState | null)[]
    morning: (WorkerState | null)[]
    evening: (WorkerState | null)[]
    night: (WorkerState | null)[]
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
    [key: string]: (WorkerState | null)[]
    morning: (WorkerState | null)[]
    evening: (WorkerState | null)[]
    night: (WorkerState | null)[]
  }
  locked: {
    [key: string]: boolean[]
    morning: boolean[]
    evening: boolean[]
    night: boolean[]
  }
}

export type ShiftTableRow = {
  date: {
    from: number
    to: number
  }
  data: {
    [key: string]: (WorkerState | null)[]
    morning: (WorkerState | null)[]
    evening: (WorkerState | null)[]
    night: (WorkerState | null)[]
  }
}

// export type ScheduleWorker = {
//   _id: string
//   name: string
//   shiftTime: string
// }

export interface ScheduleState extends ScheduleBase {
  _id: string
  updatedAt: Date
}

export type ScheduleBase = {
  ownerId: string
  date: {
    from: number
    to: number
  }
  table: TableRow[]
  workers: {
    used: WorkerState[]
    unused: WorkerState[]
  }
}

export interface MachineState extends MachineBase {
  _id: string
}

export type MachineBase = {
  ownerId?: string
  name: string
  amountOfWorkers: number
  importance: number
}

export type sessionUser = {
  username: string
  _id: string
}

export type StatisticsState = {
  machineTimeShiftsPerWorker: {
    [key: string]: {
      [key: string]: {
        [key: string]: number[]
      }
    }
  }
  timeShiftsPerWorker: {
    [key: string]: {
      [key: string]: number[] | undefined
      morning?: number[]
      evening?: number[]
      night?: number[]
    }
  }
  amountWorkedInMachinePerWorker: {
    [key: string]: {
      [key: string]: number[]
    }
  }
  amountWorkedPerMachine: {
    [key: string]: {
      [key: string]: number[]
    }
  }
}
