import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm'
import styles from './CartPage.module.css'

export default function CartPage() {
  const { cart, removeItem, updateQuantity, total, clearCart } = useCart()
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()

  const handleSuccess = () => {
    clearCart()
    setShowForm(false)
    navigate('/')
  }

  if (cart.length === 0) return (
    <div className={styles.empty}>
      <p className={styles.emptyText}>Tu carrito está vacío</p>
      <Link to="/" className={styles.emptyLink}>Ver productos</Link>
    </div>
  )

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Tu pedido</h1>

      <div className={styles.items}>
        {cart.map(item => (
          <div key={item.id} className={styles.item}>
            <img
              src={item.images[0]}
              alt={item.name}
              className={styles.itemImage}
              onError={e => { e.target.src = '/images/placeholder.jpg' }}
            />
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{item.name}</p>
              {item.price > 0 && (
                <p className={styles.itemPrice}>${(item.price * item.quantity).toLocaleString('es-AR')}</p>
              )}
            </div>
            <div className={styles.itemControls}>
              <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
              <span className={styles.qty}>{item.quantity}</span>
              <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>×</button>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className={styles.summary}>
          <span>Total</span>
          <span className={styles.total}>${total.toLocaleString('es-AR')}</span>
        </div>
      )}

      <button className={styles.checkoutBtn} onClick={() => setShowForm(true)}>Confirmar pedido</button>
      <button className={styles.clearBtn} onClick={clearCart}>Vaciar carrito</button>

      {showForm && (
        <CheckoutForm
          cart={cart}
          total={total}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
