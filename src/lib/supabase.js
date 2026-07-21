import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function fetchProductCatalog() {
  const { data, error } = await supabase.from('product_catalog').select('*')
  if (error) throw error
  return data
}

export async function fetchOrder(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function saveFeedback(orderId, rating, comment) {
  const { error } = await supabase
    .from('feedback')
    .insert([{ order_id: orderId, rating, comment: comment || null }])
  if (error) throw error
}

export async function fetchFeedback() {
  const { data, error } = await supabase
    .from('feedback')
    .select('*, orders(customer_name, customer_whatsapp)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function findWholesaleClientByCuit(cuit) {
  const { data } = await supabase
    .rpc('check_wholesale_cuit', { input_cuit: cuit })
  if (!data) return null
  // la función devuelve empresa; buscamos datos mínimos para pre-llenar el form
  const { data: row } = await supabase
    .from('wholesale_clients')
    .select('nombre, telefono, mail, empresa')
    .eq('cuit', cuit)
    .single()
  return row || { empresa: data }
}

export async function upsertWholesaleClient({ nombre, telefono, cuit, mail, empresa }) {
  const { error } = await supabase
    .from('wholesale_clients')
    .upsert({ nombre, telefono, cuit, mail: mail || null, empresa }, { onConflict: 'cuit' })
  if (error) throw error
}

export async function fetchWholesaleClients() {
  const { data, error } = await supabase
    .from('wholesale_clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateWholesaleClient(id, fields) {
  const { error } = await supabase
    .from('wholesale_clients')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}

export async function updateProductCatalog(id, fields) {
  const { error } = await supabase
    .from('product_catalog')
    .upsert({ id, ...fields }, { onConflict: 'id' })
  if (error) throw error
}

export async function saveOrder({ customer, items, total, pricing_mode = 'retail' }) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      customer_name: customer.name,
      customer_whatsapp: customer.whatsapp,
      customer_email: customer.email,
      customer_negocio: customer.negocio || null,
      items,
      total,
      pricing_mode,
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
