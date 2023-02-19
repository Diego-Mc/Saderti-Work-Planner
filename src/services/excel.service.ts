import { utilService } from './util.service'
import ExcelJS from 'exceljs'
import { ScheduleState } from '../types'

export const downloadWorkbook = (workbook: ExcelJS.Workbook) => {
  workbook.xlsx.writeBuffer().then((data: BlobPart) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'סידור.xlsx'
    anchor.click()
    window.URL.revokeObjectURL(url)
  })
}

export const scheduleToExcel = (schedule: ScheduleState) => {
  const workbook = new ExcelJS.Workbook()

  const sheet = workbook.addWorksheet('סידור', {
    pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true },
    views: [{ rightToLeft: true }],
  })

  sheet.pageSetup.printArea = `A1:D${schedule.table.length + 2}`

  sheet
    .getRow(1)
    .getCell(
      1
    ).value = `סידור עבודה שבועי לפי מכונות ${utilService.formatDateRange(
    schedule.date.from,
    schedule.date.to
  )}`
  sheet.getRow(2).getCell(1).value = 'מכונות'
  sheet.getRow(2).getCell(2).value = 'בוקר'
  sheet.getRow(2).getCell(3).value = 'ערב'
  sheet.getRow(2).getCell(4).value = 'לילה'

  const rows = schedule?.table

  rows?.forEach((row, rowIdx) => {
    sheet.getRow(3 + rowIdx).getCell(1).value = row.machine.name
    sheet.getRow(3 + rowIdx).getCell(2).value = row.data.morning
      .map((w) => w?.name || '')
      .filter((w) => w.length !== 0)
      .join(' + ')
    sheet.getRow(3 + rowIdx).getCell(3).value = row.data.evening
      .map((w) => w?.name || '')
      .filter((w) => w.length !== 0)
      .join(' + ')
    sheet.getRow(3 + rowIdx).getCell(4).value = row.data.night
      .map((w) => w?.name || '')
      .filter((w) => w.length !== 0)
      .join(' + ')
  })

  sheet.getColumn(1).font = { name: 'Arial', size: 38, bold: true }
  sheet.getColumn(1).alignment = { horizontal: 'center', vertical: 'middle' }
  sheet.getColumn(2).font = { name: 'Arial', size: 26, bold: false }
  sheet.getColumn(2).alignment = { horizontal: 'center', vertical: 'middle' }
  sheet.getColumn(3).font = { name: 'Arial', size: 26, bold: false }
  sheet.getColumn(3).alignment = { horizontal: 'center', vertical: 'middle' }
  sheet.getColumn(4).font = { name: 'Arial', size: 26, bold: false }
  sheet.getColumn(4).alignment = { horizontal: 'center', vertical: 'middle' }
  sheet.getRow(1).font = { name: 'Arial', size: 33, bold: true }
  sheet.getRow(1).alignment = { vertical: 'middle' }
  sheet.getRow(2).font = { name: 'Arial', size: 38, bold: true }
  sheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' }

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.height = 66
      row.alignment = { horizontal: 'right', vertical: 'middle' }
      return
    }
    row.height = 42
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
    })
  })

  // sheet.getRows(1, 4)
  createOuterBorder(sheet, { row: 1, col: 1 }, { row: 1, col: 4 })

  sheet.getColumn(1).width = 32
  sheet.getColumn(2).width = 32
  sheet.getColumn(3).width = 32
  sheet.getColumn(4).width = 32

  return workbook
}

const createOuterBorder = (
  worksheet: ExcelJS.Worksheet,
  start = { row: 1, col: 1 },
  end = { row: 1, col: 1 },
  borderWidth = 'thin'
) => {
  const borderStyle = {
    style: borderWidth,
  } as Partial<ExcelJS.Border>

  for (let i = start.row; i <= end.row; i++) {
    const leftBorderCell = worksheet.getCell(i, start.col)
    const rightBorderCell = worksheet.getCell(i, end.col)
    leftBorderCell.border = {
      ...leftBorderCell.border,
      left: borderStyle,
    }
    rightBorderCell.border = {
      ...rightBorderCell.border,
      right: borderStyle,
    }
  }

  for (let i = start.col; i <= end.col; i++) {
    const topBorderCell = worksheet.getCell(start.row, i)
    const bottomBorderCell = worksheet.getCell(end.row, i)
    topBorderCell.border = {
      ...topBorderCell.border,
      top: borderStyle,
    }
    bottomBorderCell.border = {
      ...bottomBorderCell.border,
      bottom: borderStyle,
    }
  }
}
