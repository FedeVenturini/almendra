import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { cart, addItem, updateQuantity } = useCart()
  const cartItem = cart.find(i => i.id === product.id)
  const qty = cartItem?.quantity ?? 0

  return (
    <div className={styles.card}>
      {product.badge && (
        <span className={`${styles.badge} ${styles[product.badge.toLowerCase()]}`}>
          {product.badge}
        </span>
      )}

      <Link to={`/producto/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <img
            src={product.images[0]}
            alt={product.name}
            className={styles.image}
            onError={e => { e.target.src = '/images/placeholder.jpg' }}
          />
        </div>
      </Link>

      <div className={styles.info}>
        <Link to={`/producto/${product.slug}`} className={styles.nameLink}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        {qty === 0 ? (
          <button className={styles.addBtn} onClick={() => addItem(product)} aria-label="Agregar al carrito">
            +
          </button>
        ) : (
          <div className={styles.counter}>
            <button
              className={styles.counterBtn}
              onClick={() => updateQuantity(product.id, qty - 1)}
              aria-label="Quitar uno"
            >−</button>
            <span className={styles.counterQty}>{qty}</span>
            <button
              className={styles.counterBtn}
              onClick={() => addItem(product)}
              aria-label="Agregar uno más"
            >+</button>
          </div>
        )}
      </div>
    </div>
  )
}
