import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './assets/styles/main.scss'
import { WorkersShiftSetup } from './views/WorkersShiftSetup'
import { WorkersTable } from './views/WorkersTable'

export type Worker = {
  name: string
  currTimeShift: string
  history: [
    {
      machine: string
      dates: Date[]
      timeShifts: string[]
    }
  ]
}

export type rowType = {
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

const workersRaw: Worker[] = [
  {
    name: 'אירוס',
    currTimeShift: 'morning',
    history: [
      {
        machine: '6+7',
        dates: [new Date('12-12-2022'), new Date('05-01-2023')],
        timeShifts: ['morning', 'night'],
      },
    ],
  },
  {
    name: 'רונית',
    currTimeShift: '',
    history: [
      {
        machine: '6+7',
        dates: [new Date('12-12-2022'), new Date('05-01-2023')],
        timeShifts: ['morning', 'night'],
      },
    ],
  },
  {
    name: 'שמרית',
    currTimeShift: 'night',
    history: [
      {
        machine: '6+7',
        dates: [new Date('12-12-2022'), new Date('05-01-2023')],
        timeShifts: ['morning', 'night'],
      },
    ],
  },
]

const tableRaw: rowType[] = [
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <WorkersTable tableRaw={tableRaw} workersRaw={workersRaw} />,
  },
  {
    path: '/new',
    element: <WorkersShiftSetup workers={workersRaw} />,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <RouterProvider router={router} />
    </DndProvider>
  </React.StrictMode>
)
