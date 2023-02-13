import { BrowserRouter, useRoutes } from 'react-router-dom'
import { Header } from './cmps/Header'
import { WorkerDashboard } from './cmps/WorkerDashboard'
import { addWorker } from './features/workers/workersSlice'
import { useAppDispatch } from './hooks'
import { Home } from './views/Home'
import { WorkersManagement } from './views/WorkersManagement'
// import { tableDemo } from './table-demo-data.json'
import { WorkersShiftSetup } from './views/WorkersShiftSetup'
import { WorkersTable } from './views/WorkersTable'

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
        path: '/schedule/:scheduleId',
        element: <WorkersTable />,
      },
      {
        path: '/new',
        element: <WorkersShiftSetup />,
      },
    ])
    return router
  }

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
