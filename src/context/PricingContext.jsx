import { createContext, useContext, useState } from 'react'
import { findWholesaleClientByCuit } from '../lib/supabase'

const PricingContext = createContext()

const WHOLESALE_PASSWORD = import.meta.env.VITE_WHOLESALE_PASSWORD

export function PricingProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('almendra-pricing-mode') ?? 'retail'
  )
  const [empresa, setEmpresa] = useState(
    () => localStorage.getItem('almendra-wholesale-empresa') ?? null
  )

  const unlockWholesale = async (password) => {
    // Contraseña default
    if (password === WHOLESALE_PASSWORD) {
      setMode('wholesale')
      setEmpresa(null)
      localStorage.setItem('almendra-pricing-mode', 'wholesale')
      localStorage.removeItem('almendra-wholesale-empresa')
      return { ok: true, empresa: null }
    }
    // Intentar como CUIT
    const client = await findWholesaleClientByCuit(password)
    if (client) {
      setMode('wholesale')
      setEmpresa(client.empresa)
      localStorage.setItem('almendra-pricing-mode', 'wholesale')
      localStorage.setItem('almendra-wholesale-empresa', client.empresa)
      return { ok: true, empresa: client.empresa }
    }
    return { ok: false }
  }

  const exitWholesale = () => {
    setMode('retail')
    setEmpresa(null)
    localStorage.removeItem('almendra-pricing-mode')
    localStorage.removeItem('almendra-wholesale-empresa')
  }

  return (
    <PricingContext.Provider value={{ mode, empresa, unlockWholesale, exitWholesale }}>
      {children}
    </PricingContext.Provider>
  )
}

export const usePricing = () => useContext(PricingContext)
