import { Link } from 'react-router-dom'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  return (
    <Link to={`/producto/${product.slug}`} className={styles.card}>
      {product.badge && (
        <span className={`${styles.badge} ${styles[product.badge.toLowerCase()]}`}>
          {product.badge}
        </span>
      )}
      <div className={styles.imageWrap}>
        <img
          src={product.images[0]}
          alt={product.name}
          className={styles.image}
          onError={e => { e.target.src = '/images/placeholder.jpg' }}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
      </div>
    </Link>
  )
}
