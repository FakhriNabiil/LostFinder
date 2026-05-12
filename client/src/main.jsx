import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

document.documentElement.classList.add('dark')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "'Inter', system-ui, sans-serif",
          background: 'var(--color-background)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
          fontSize: '13px',
          borderRadius: '8px',
          padding: '12px 16px',
        },
        success: { iconTheme: { primary: 'var(--color-success)', secondary: '#fff' } },
        error: { iconTheme: { primary: 'var(--color-error)', secondary: '#fff' } },
      }}
    />
  </React.StrictMode>,
)
