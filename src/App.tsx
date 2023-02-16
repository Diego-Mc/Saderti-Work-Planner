import { useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { Header } from './cmps/Header'
import { MachineDashboard } from './cmps/MachineDashboard'
import { ScheduleDashboard } from './cmps/ScheduleDashboard'
import { WorkerDashboard } from './cmps/WorkerDashboard'
import { usePrefetch } from './features/statistics/statisticsSlice'
import { addWorker } from './features/workers/workersSlice'
import { useAppDispatch } from './hooks'
import { Home } from './views/Home'
import { MachinesManagement } from './views/MachinesManagement'
import { SchedulesManagement } from './views/SchedulesManagement'
import { WorkersManagement } from './views/WorkersManagement'
// import { tableDemo } from './table-demo-data.json'
import { ScheduleSettings } from './views/ScheduleSettings'
import { ScheduleEdit } from './views/ScheduleEdit'

const App = () => {
  const Router = () => {
    const router = useRoutes([
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/workers',
        element: <WorkersManagement />,
        children: [
          {
            path: ':workerId',
            element: <WorkerDashboard />,
          },
        ],
      },
      {
        path: '/machines',
        element: <MachinesManagement />,
        children: [
          {
            path: ':machineId',
            element: <MachineDashboard />,
          },
        ],
      },
      {
        path: '/schedules',
        element: <SchedulesManagement />,
        children: [
          {
            path: ':scheduleId',
            element: <ScheduleDashboard />,
          },
        ],
      },
      {
        path: '/edit/:scheduleId',
        element: <ScheduleEdit />,
      },
      {
        path: '/new',
        element: <ScheduleSettings />,
      },
    ])
    return router
  }

  const prefetchStatistics = usePrefetch('getStatistics')

  useEffect(() => {
    prefetchStatistics()
  })

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Router />
      </BrowserRouter>
    </div>
  )
}

export default App
