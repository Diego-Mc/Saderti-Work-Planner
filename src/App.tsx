import { useState } from 'react'
import { row, Table } from './cmps/Table'

function App() {
  const tableRaw: row[] = [
    {
      machine: '16',
      data: {
        morning: ['אירוס', null],
        evening: ['הולא', 'ליה'],
        night: ['זוהרה', 'גלינה'],
      },
      locked: {
        morning: [false, true],
        evening: [false, false],
        night: [true, false],
      },
      workersAmount: 2,
    },
    {
      machine: '15',
      data: {
        morning: ['נאויל'],
        evening: ['אלה'],
        night: ['אמרץ'],
      },
      locked: {
        morning: [false],
        evening: [false],
        night: [true],
      },
      workersAmount: 1,
    },
    {
      machine: '11+12',
      data: {
        morning: ['רחל'],
        evening: ['רשא'],
        night: ['רותי'],
      },
      locked: {
        morning: [false],
        evening: [false],
        night: [false],
      },
      workersAmount: 1,
    },
    {
      machine: '6+7',
      data: {
        morning: ['שאדיה'],
        evening: [null],
        night: ['סבטלנה'],
      },
      locked: {
        morning: [true],
        evening: [true],
        night: [false],
      },
      workersAmount: 1,
    },
  ]

  const [table, setTable] = useState(tableRaw)

  return (
    <div className="App">
      <Table table={table} setTable={setTable} />
    </div>
  )
}

export default App
