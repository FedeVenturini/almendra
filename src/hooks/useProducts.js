import { useEffect, useState } from 'react'
import { products as staticProducts } from '../data/products'
import { fetchProductCatalog } from '../lib/supabase'

export function useProducts() {
  const [catalog, setCatalog] = useState(null)

  useEffect(() => {
    fetchProductCatalog()
      .then(data => setCatalog(data))
      .catch(() => setCatalog([]))
  }, [])

  const products = staticProducts.map(p => {
    const row = catalog?.find(r => r.id === p.id)
    return { ...p, price: row?.price ?? 0, stock: row?.stock ?? 0 }
  })

  return { products, loading: catalog === null }
}
