import { useState } from 'react'
import { saveOrder } from '../../lib/supabase'
import styles from './CheckoutForm.module.css'

const WHATSAPP_NUMBER = '543564349049'

function buildWhatsAppMessage(customer, items, total) {
  const lines = items.map(i => `• ${i.name} x${i.quantity}${i.price > 0 ? ` — $${(i.price * i.quantity).toLocaleString('es-AR')}` : ''}`)
  const totalLine = total > 0 ? `\n*Total: $${total.toLocaleString('es-AR')}*` : ''
  return encodeURIComponent(
    `¡Hola! Soy *${customer.name}* y quiero hacer este pedido:\n\n${lines.join('\n')}${totalLine}\n\nMi mail: ${customer.email}`
  )
}

export default function CheckoutForm({ cart, total, onSuccess }) {
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await saveOrder({
        customer: form,
        items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        total,
      })

      const msg = buildWhatsAppMessage(form, cart, total)
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
      onSuccess()
    } catch (err) {
      console.error(err)
      setError('Hubo un error al enviar el pedido. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Tus datos</h2>
        <p className={styles.subtitle}>Para coordinar tu pedido</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Nombre
            <input
              className={styles.input}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </label>
          <label className={styles.label}>
            WhatsApp
            <input
              className={styles.input}
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="Ej: 1150001234"
              required
            />
          </label>
          <label className={styles.label}>
            Mail
            <input
              className={styles.input}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@mail.com"
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar pedido por WhatsApp'}
          </button>
        </form>

        <button className={styles.cancelBtn} onClick={onSuccess}>Cancelar</button>
      </div>
    </div>
  )
}
