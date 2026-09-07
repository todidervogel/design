import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Gallery from './Gallery'
import '../src/styles/tokens.css'
import '../src/styles/base.css'
import '../src/styles/components.css'
import '../src/styles/layout.css'
import './gallery.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Einige Bausteine enthalten Links — deshalb ein Router drumherum. */}
    <BrowserRouter>
      <Gallery />
    </BrowserRouter>
  </StrictMode>,
)
