import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TeamPortalApp } from './apps/TeamPortalApp.tsx'
import { OperationsPortalApp } from './apps/OperationsPortalApp.tsx'

const App = import.meta.env.VITE_PORTAL === 'operations' ? OperationsPortalApp : TeamPortalApp

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
)