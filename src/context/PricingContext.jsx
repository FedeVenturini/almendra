import { createContext, useContext, useState } from 'react'
import { findWholesaleClientByCuit } from '../lib/supabase'

const PricingContext = createContext()

const WHOLESALE_PASSWORD = import.meta.env.VITE_WHOLESALE_PASSWORD

export function PricingProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('almendra-pricing-mode') ?? 'retail'
  )
  const [wholesaleClient, setWholesaleClient] = useState(() => {
    try {
      const stored = localStorage.getItem('almendra-wholesale-client')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const unlockWholesale = async (password) => {
    if (password === WHOLESALE_PASSWORD) {
      setMode('wholesale')
      setWholesaleClient(null)
      localStorage.setItem('almendra-pricing-mode', 'wholesale')
      localStorage.removeItem('almendra-wholesale-client')
      return { ok: true }
    }
    const client = await findWholesaleClientByCuit(password)
    if (client) {
      setMode('wholesale')
      setWholesaleClient(client)
      localStorage.setItem('almendra-pricing-mode', 'wholesale')
      localStorage.setItem('almendra-wholesale-client', JSON.stringify(client))
      return { ok: true }
    }
    return { ok: false }
  }

  const exitWholesale = () => {
    setMode('retail')
    setWholesaleClient(null)
    localStorage.removeItem('almendra-pricing-mode')
    localStorage.removeItem('almendra-wholesale-client')
  }

  const empresa = wholesaleClient?.empresa ?? null

  return (
    <PricingContext.Provider value={{ mode, empresa, wholesaleClient, unlockWholesale, exitWholesale }}>
      {children}
    </PricingContext.Provider>
  )
}

export const usePricing = () => useContext(PricingContext)
