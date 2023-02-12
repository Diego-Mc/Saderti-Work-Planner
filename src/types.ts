export type WorkerIdentifier = {
  machine: string
  shiftTime: string
  idx: number
}

export type TableRow = {
  machine: string
  data: {
    [key: string]: (string | null)[]
    morning: (string | null)[]
    evening: (string | null)[]
    night: (string | null)[]
  }
  locked: {
    [key: string]: boolean[]
    morning: boolean[]
    evening: boolean[]
    night: boolean[]
  }
  workersAmount: number
}

export type ScheduleState = {
  _id: string
  date: number
  table: TableRow[]
}
