import { createContext, useContext, useState } from 'react'

const PricingContext = createContext()

const WHOLESALE_PASSWORD = import.meta.env.VITE_WHOLESALE_PASSWORD

export function PricingProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('almendra-pricing-mode') ?? 'retail'
  )

  const unlockWholesale = (password) => {
    if (password === WHOLESALE_PASSWORD) {
      setMode('wholesale')
      localStorage.setItem('almendra-pricing-mode', 'wholesale')
      return true
    }
    return false
  }

  const exitWholesale = () => {
    setMode('retail')
    localStorage.removeItem('almendra-pricing-mode')
  }

  return (
    <PricingContext.Provider value={{ mode, unlockWholesale, exitWholesale }}>
      {children}
    </PricingContext.Provider>
  )
}

export const usePricing = () => useContext(PricingContext)
