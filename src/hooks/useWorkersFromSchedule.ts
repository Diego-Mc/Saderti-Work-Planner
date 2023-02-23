import { ScheduleState } from '../types'

export const useWorkersFromSchedule = (schedule: ScheduleState) => {
  const data = schedule.table
    .map((r) => r.data)
    .reduce(
      (acc, curr) => {
        acc.morning.push(...curr.morning)
        acc.evening.push(...curr.evening)
        acc.night.push(...curr.night)
        return acc
      },
      { morning: [], evening: [], night: [] }
    )

  return {
    date: schedule.date,
    data,
  }
}
