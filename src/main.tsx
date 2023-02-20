import React, { lazy, Suspense } from 'react'
import { DndProvider } from 'react-dnd'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'

import { store } from './store'
import { TouchBackend } from 'react-dnd-touch-backend'

const DndPreview = lazy(() => import('./cmps/DndPreview'))

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <Provider store={store}>
        <App />
        <Suspense>
          <DndPreview />
        </Suspense>
      </Provider>
    </DndProvider>
  </React.StrictMode>
)
