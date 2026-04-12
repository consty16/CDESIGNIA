import React from 'react'
import ReactDOM from 'react-dom/client'
import { IALab } from './components/IALab.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('ia-lab-root')!).render(
  <React.StrictMode>
    <IALab />
  </React.StrictMode>,
)
