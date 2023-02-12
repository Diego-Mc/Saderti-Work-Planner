import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { addSchedule } from './features/schedules/schedulesSlice'
import { addWorker } from './features/workers/workersSlice'
import { useAppDispatch } from './hooks'
import { tableDemo } from './table-demo-data'
import { WorkersShiftSetup } from './views/WorkersShiftSetup'
import { WorkersTable } from './views/WorkersTable'

const App = () => {
  const dispatch = useAppDispatch()
  dispatch(addWorker({ _id: 'fgdfgh', currTimeShift: '', name: 'מיכל' }))
  dispatch(addWorker({ _id: 'vsd', currTimeShift: '', name: 'יהונתן' }))
  dispatch(addWorker({ _id: 'fdf', currTimeShift: '', name: 'בני' }))

  dispatch(addSchedule({ _id: 'dsfs', date: Date.now(), table: tableDemo }))

  const router = createBrowserRouter([
    {
      path: '/',
      element: <WorkersTable />,
    },
    {
      path: '/new',
      element: <WorkersShiftSetup />,
    },
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
