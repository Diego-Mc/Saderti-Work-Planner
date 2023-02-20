import { Suspense, lazy } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'

// import 'https://rsms.me/inter/inter.css'
import 'rsuite/dist/rsuite.min.css'
import './assets/styles/main.scss'
import { Loader } from './cmps/Loader'

const Header = lazy(() => import('./cmps/Header'))
const Home = lazy(() => import('./views/Home'))
const MachinesManagement = lazy(() => import('./views/MachinesManagement'))
const SchedulesManagement = lazy(() => import('./views/SchedulesManagement'))
const WorkersManagement = lazy(() => import('./views/WorkersManagement'))
const ScheduleSettings = lazy(() => import('./views/ScheduleSettings'))
const ScheduleEdit = lazy(() => import('./views/ScheduleEdit'))

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
            // element: <WorkerDashboard />,
          },
        ],
      },
      {
        path: '/machines',
        element: <MachinesManagement />,
        children: [
          {
            path: ':machineId',
            // element: <MachineDashboard />,
          },
        ],
      },
      {
        path: '/schedules',
        element: <SchedulesManagement />,
        children: [
          {
            path: ':scheduleId',
            // element: <ScheduleDashboard />,
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

  return (
    <div className="App">
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <Header />
          <Router />
        </BrowserRouter>
      </Suspense>
    </div>
  )
}

export default App
