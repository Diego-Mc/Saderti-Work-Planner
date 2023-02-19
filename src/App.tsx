import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'

// import 'https://rsms.me/inter/inter.css'
import 'rsuite/dist/rsuite.min.css'
import './assets/styles/main.scss'
import { apiSlice } from './features/api/apiSlice'
import { statisticsApi } from './features/statistics/statisticsSlice'

import Header from './cmps/Header'
const Home = lazy(() => import('./views/Home'))
const MachineDashboard = lazy(() => import('./cmps/MachineDashboard'))
const ScheduleDashboard = lazy(() => import('./cmps/ScheduleDashboard'))
const WorkerDashboard = lazy(() => import('./cmps/WorkerDashboard'))
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
        element: (
          <Suspense>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/workers',
        element: (
          <Suspense>
            <WorkersManagement />
          </Suspense>
        ),
        children: [
          {
            path: ':workerId',
            element: (
              <Suspense>
                <WorkerDashboard />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/machines',
        element: (
          <Suspense>
            <MachinesManagement />
          </Suspense>
        ),
        children: [
          {
            path: ':machineId',
            element: (
              <Suspense>
                <MachineDashboard />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/schedules',
        element: (
          <Suspense>
            <SchedulesManagement />
          </Suspense>
        ),
        children: [
          {
            path: ':scheduleId',
            element: (
              <Suspense>
                <ScheduleDashboard />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/edit/:scheduleId',
        element: (
          <Suspense>
            <ScheduleEdit />
          </Suspense>
        ),
      },
      {
        path: '/new',
        element: (
          <Suspense>
            <ScheduleSettings />
          </Suspense>
        ),
      },
    ])
    return router
  }

  const prefetchUser = apiSlice.usePrefetch('fetchUser')
  const prefetchStatistics = statisticsApi.usePrefetch('getStatistics')

  useEffect(() => {
    prefetchUser()
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
