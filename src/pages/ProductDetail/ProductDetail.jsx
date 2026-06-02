import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { products } from '../../data/products'
import { useCart } from '../../context/CartContext'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const product = products.find(p => p.slug === slug)
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)

  if (!product) return (
    <div className={styles.notFound}>
      <p>Producto no encontrado</p>
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  )

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

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
        {product.price > 0 && (
          <p className={styles.price}>${product.price.toLocaleString('es-AR')}</p>
        )}
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}
        <button className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`} onClick={handleAdd}>
          {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}
