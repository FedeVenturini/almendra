import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { PricingProvider } from './context/PricingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PricingProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </PricingProvider>
    </BrowserRouter>
  </StrictMode>,
)
