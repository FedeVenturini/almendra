import { createContext, useContext, useState } from 'react'

const PricingContext = createContext()

const WHOLESALE_PASSWORD = 'AlmendraMayorista'

export function PricingProvider({ children }) {
  const [mode, setMode] = useState('retail') // 'retail' | 'wholesale'

  const unlockWholesale = (password) => {
    if (password === WHOLESALE_PASSWORD) {
      setMode('wholesale')
      return true
    }
    return false
  }

  const exitWholesale = () => setMode('retail')

  return (
    <PricingContext.Provider value={{ mode, unlockWholesale, exitWholesale }}>
      {children}
    </PricingContext.Provider>
  )
}

export const usePricing = () => useContext(PricingContext)
