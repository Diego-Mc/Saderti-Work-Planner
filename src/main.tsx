import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import 'rsuite/dist/rsuite.min.css'
import './assets/styles/main.scss'
import { store } from './store'
import { TouchBackend } from 'react-dnd-touch-backend'
import { usePreview } from 'react-dnd-preview'

const MyPreview = () => {
  const preview = usePreview()
  if (!preview.display) {
    return null
  }
  const { itemType, item, style } = preview
  return (
    <div
      className="worker-item"
      style={{ ...style, transition: 'all 0.01s', zIndex: 100 }}>
      {(item as { name: string }).name}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <Provider store={store}>
        <App />
        <MyPreview />
      </Provider>
    </DndProvider>
  </React.StrictMode>
)
