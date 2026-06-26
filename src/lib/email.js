import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export async function sendOrderConfirmation({ customerName, customerEmail, items, total, orderId }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return

  const itemsList = items
    .map(i => `• ${i.name} x${i.quantity}${i.price > 0 ? ` — $${(i.price * i.quantity).toLocaleString('es-AR')}` : ''}`)
    .join('\n')

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_name: customerName,
      to_email: customerEmail,
      order_id: orderId,
      items_list: itemsList,
      total: total > 0 ? `$${total.toLocaleString('es-AR')}` : 'A coordinar',
    },
    PUBLIC_KEY
  )
}
