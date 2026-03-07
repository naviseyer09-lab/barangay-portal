import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import './styles/index.css'
import { initializeAdminAccounts } from './lib/api'

// Initialize admin accounts on app start
initializeAdminAccounts();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)