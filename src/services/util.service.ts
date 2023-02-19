import moment, { Moment } from 'moment'

export const utilService = {
  getRandomInt,
  formatDateRange,
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function formatDateRange(
  from: Date | number | Moment,
  to: Date | number | Moment
): string {
  const fromDay = moment(from).date()
  const toDay = moment(to).date()
  const fromMonth = moment(from).month() + 1
  const toMonth = moment(to).month() + 1
  const fromYear = moment(from).year()
  const toYear = moment(to).year()

  if (fromYear !== toYear) {
    return `${moment(from).format('DD/MM/yyyy')}-${moment(to).format(
      'DD/MM/yyyy'
    )}`
  }

  if (fromMonth !== toMonth) {
    return `${moment(from).format('DD/MM')}-${moment(to).format('DD/MM/yyyy')}`
  }

  return `${moment(from).format('DD')}-${moment(to).format('DD/MM/yyyy')}`
}
