import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function fetchProductCatalog() {
  const { data, error } = await supabase.from('product_catalog').select('*')
  if (error) throw error
  return data
}

export async function updateProductCatalog(id, fields) {
  const { error } = await supabase
    .from('product_catalog')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}

export async function saveOrder({ customer, items, total }) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      customer_name: customer.name,
      customer_whatsapp: customer.whatsapp,
      customer_email: customer.email,
      items,
      total,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single()

  if (error) throw error

  // Descontar stock
  for (const item of items) {
    const { data: row } = await supabase
      .from('product_catalog')
      .select('stock')
      .eq('id', item.id)
      .single()

    if (row && row.stock > 0) {
      await supabase
        .from('product_catalog')
        .update({ stock: Math.max(0, row.stock - item.quantity) })
        .eq('id', item.id)
    }
  }

  return data
}
