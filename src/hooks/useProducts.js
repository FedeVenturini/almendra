import { useEffect, useState } from 'react'
import { products as staticProducts } from '../data/products'
import { fetchProductCatalog } from '../lib/supabase'
import { usePricing } from '../context/PricingContext'

export function useProducts() {
  const [catalog, setCatalog] = useState(null)
  const { mode } = usePricing()

  useEffect(() => {
    fetchProductCatalog()
      .then(data => setCatalog(data))
      .catch(() => setCatalog([]))
  }, [])

  const products = staticProducts.map(p => {
    const row = catalog?.find(r => r.id === p.id)
    const retailPrice = row?.price ?? 0
    const wholesalePrice = row?.wholesale_price ?? 0
    const price = mode === 'wholesale' ? wholesalePrice : retailPrice
    return { ...p, price, stock: row?.stock ?? 0 }
  })

  return { products, loading: catalog === null }
}
