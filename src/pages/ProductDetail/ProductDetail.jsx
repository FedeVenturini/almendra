import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { useCart } from '../../context/CartContext'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { cart, addItem, updateQuantity } = useCart()
  const { products, loading } = useProducts()
  const [activeImg, setActiveImg] = useState(0)

  if (loading) return <div className={styles.notFound}><p>Cargando...</p></div>

  const product = products.find(p => p.slug === slug)

  if (!product) return (
    <div className={styles.notFound}>
      <p>Producto no encontrado</p>
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  )

  const cartItem = cart.find(i => i.id === product.id)
  const qty = cartItem?.quantity ?? 0

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Volver</button>

      <div className={styles.gallery}>
        <img
          src={product.images[activeImg]}
          alt={product.name}
          className={styles.mainImage}
          onError={e => { e.target.src = '/images/placeholder.jpg' }}
        />
        {product.images.length > 1 && (
          <div className={styles.thumbs}>
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  onError={e => { e.target.src = '/images/placeholder.jpg' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h1 className={styles.name}>{product.name}</h1>
        {product.price > 0
          ? <p className={styles.price}>${product.price.toLocaleString('es-AR')}</p>
          : <p className={styles.priceConsult}>Consultá el precio</p>
        }
        <p className={styles.description}>{product.description}</p>
        {qty === 0 ? (
          <button className={styles.addBtn} onClick={() => addItem(product)}>
            Agregar al carrito
          </button>
        ) : (
          <div className={styles.cartControl}>
            <button className={styles.ctrlBtn} onClick={() => updateQuantity(product.id, qty - 1)}>−</button>
            <span className={styles.ctrlQty}>{qty} en el carrito</span>
            <button className={styles.ctrlBtn} onClick={() => addItem(product)}>+</button>
          </div>
        )}
        <p className={styles.disclaimer}>
          * Los precios son orientativos y están sujetos a cambios sin previo aviso. El precio final será confirmado al coordinar el pedido.
        </p>
      </div>
    </div>
  )
}
