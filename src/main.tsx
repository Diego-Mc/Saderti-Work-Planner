import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import 'rsuite/dist/rsuite.min.css'
import './assets/styles/main.scss'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <App />
      </Provider>
    </DndProvider>
  </React.StrictMode>
)
