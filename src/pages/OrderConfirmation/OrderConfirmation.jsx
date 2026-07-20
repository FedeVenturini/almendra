import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { saveFeedback, fetchOrder } from '../../lib/supabase'
import styles from './OrderConfirmation.module.css'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const { state } = useLocation()

  const [items, setItems] = useState(state?.items || null)
  const [total, setTotal] = useState(state?.total || null)
  const [waUrl, setWaUrl] = useState(state?.waUrl || null)
  const [loadingOrder, setLoadingOrder] = useState(!state?.items)

  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (state?.items) return
    fetchOrder(orderId)
      .then(order => {
        setItems(order.items)
        setTotal(order.total)
      })
      .catch(console.error)
      .finally(() => setLoadingOrder(false))
  }, [orderId, state])

  const handleFeedback = async () => {
    if (!rating) return
    setSending(true)
    try {
      await saveFeedback(orderId, rating, comment)
      setSent(true)
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  if (loadingOrder) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p style={{ color: 'var(--color-text-light)' }}>Cargando pedido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.checkIcon}>✓</div>
        <h1 className={styles.title}>¡Pedido realizado!</h1>
        <p className={styles.subtitle}>Tu pedido fue registrado. Ahora coordiná la entrega por WhatsApp.</p>
        <p className={styles.disclaimer}>⚠️ Este pedido es una intención de compra. La disponibilidad de los productos se confirma al coordinar la entrega.</p>
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            Enviar pedido por WhatsApp
          </a>
        )}

        <hr className={styles.divider} />

        {items && items.length > 0 && (
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Tu pedido</h2>
            <ul className={styles.itemList}>
              {items.map(item => (
                <li key={item.id} className={styles.itemRow}>
                  <span className={styles.itemName}>{item.name} <span className={styles.itemQty}>×{item.quantity}</span></span>
                  {item.price > 0 && (
                    <span className={styles.itemPrice}>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  )}
                </li>
              ))}
            </ul>
            {total > 0 && (
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmount}>${total.toLocaleString('es-AR')}</span>
              </div>
            )}
          </div>
        )}

        <hr className={styles.divider} />

        <div className={styles.feedback}>
          <h2 className={styles.feedbackTitle}>¿Cómo fue tu experiencia?</h2>
          <p className={styles.feedbackSub}>Tu opinión nos ayuda a mejorar</p>

          {sent ? (
            <div className={styles.thankYou}>
              <span className={styles.thankIcon}>🤎</span>
              <p>¡Gracias por tu opinión!</p>
            </div>
          ) : (
            <>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className={`${styles.star} ${star <= (hovered || rating) ? styles.starFilled : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                  >★</button>
                ))}
              </div>

              <textarea
                className={styles.commentInput}
                placeholder="¿Algo para contarnos? (opcional)"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
              />

              <button
                className={styles.sendBtn}
                onClick={handleFeedback}
                disabled={!rating || sending}
              >
                {sending ? 'Enviando...' : 'Enviar opinión'}
              </button>
            </>
          )}
        </div>

        <Link to="/" className={styles.homeLink}>← Volver a la tienda</Link>
      </div>
    </div>
  )
}
