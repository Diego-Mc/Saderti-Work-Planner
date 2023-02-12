import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './assets/styles/main.scss'
import { store } from './store'
import { TableRow } from './types'

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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <App />
      </Provider>
    </DndProvider>
  </React.StrictMode>
)
