import moment from 'moment'

export const scheduleService = {
  getNextDates,
}

function getNextDates() {
  return {
    from: +moment().day(6),
    to: +moment().day(5 + 7),
  }
}
