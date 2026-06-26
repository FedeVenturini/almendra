import { useState } from 'react'
import { saveOrder } from '../../lib/supabase'
import { usePricing } from '../../context/PricingContext'
import styles from './CheckoutForm.module.css'

const WHATSAPP_NUMBER = '543564349049'

function buildWhatsAppMessage(customer, items, total) {
  const lines = items.map(i => `• ${i.name} x${i.quantity}${i.price > 0 ? ` — $${(i.price * i.quantity).toLocaleString('es-AR')}` : ''}`)
  const totalLine = total > 0 ? `\n*Total: $${total.toLocaleString('es-AR')}*` : ''
  const negocioLine = customer.negocio ? `\nNegocio: ${customer.negocio}` : ''
  return encodeURIComponent(
    `¡Hola! Soy *${customer.name}* y quiero hacer este pedido:\n\n${lines.join('\n')}${totalLine}\n\nMi mail: ${customer.email}${negocioLine}`
  )
}

function validate(form, mode) {
  const errors = {}
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = 'Ingresá tu nombre completo'
  const phone = form.whatsapp.replace(/\D/g, '')
  if (!phone || phone.length < 8 || phone.length > 15)
    errors.whatsapp = 'Ingresá un número válido (solo dígitos)'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Ingresá un mail válido'
  if (mode === 'wholesale' && !form.negocio.trim())
    errors.negocio = 'Ingresá el nombre de tu negocio'
  return errors
}

export default function CheckoutForm({ cart, total, onSuccess }) {
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '', negocio: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { mode } = usePricing()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(fe => ({ ...fe, [name]: null }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errors = validate(form, mode)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setLoading(true)
    setError(null)

    try {
      const order = await saveOrder({
        customer: form,
        items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        total,
        pricing_mode: mode,
      })

      const msg = buildWhatsAppMessage(form, cart, total)
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
      onSuccess(order.id, cart, total, waUrl)
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

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <label className={styles.label}>
            Nombre
            <input
              className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
            {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
          </label>
          <label className={styles.label}>
            WhatsApp
            <input
              className={`${styles.input} ${fieldErrors.whatsapp ? styles.inputError : ''}`}
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="Ej: 3564349049"
              inputMode="numeric"
            />
            {fieldErrors.whatsapp && <span className={styles.fieldError}>{fieldErrors.whatsapp}</span>}
          </label>
          <label className={styles.label}>
            Mail
            <input
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@mail.com"
            />
            {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
          </label>
          {mode === 'wholesale' && (
            <label className={styles.label}>
              Empresa / Negocio
              <input
                className={`${styles.input} ${fieldErrors.negocio ? styles.inputError : ''}`}
                name="negocio"
                value={form.negocio}
                onChange={handleChange}
                placeholder="Nombre de tu negocio o empresa"
              />
              {fieldErrors.negocio && <span className={styles.fieldError}>{fieldErrors.negocio}</span>}
            </label>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Confirmar pedido'}
          </button>
        </form>

        <button className={styles.cancelBtn} onClick={onSuccess}>Cancelar</button>
      </div>
    </div>
  )
}
