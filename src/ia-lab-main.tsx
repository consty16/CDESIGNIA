import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { IALab } from './components/IALab.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('ia-lab-root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <IALab />
    </BrowserRouter>
  </React.StrictMode>,
)
