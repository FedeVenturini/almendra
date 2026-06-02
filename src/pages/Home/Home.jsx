import { useState } from 'react'
import { products, categories } from '../../data/products'
import ProductCard from '../../components/ProductCard/ProductCard'
import styles from './Home.module.css'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('todos')

  const filtered = activeCategory === 'todos'
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <img
          src="/images/foto-hero.jpg"
          alt="Almendra"
          className={styles.heroImage}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.brand}>
          <p className={styles.brandSub}>Panadería artesanal</p>
          <h1 className={styles.brandName}>Almendra</h1>
        </div>

        <div className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <p className={styles.ctaLabel}>¿Qué se te antoja?</p>
            <h2 className={styles.ctaTitle}>Armá tu<br />pedido</h2>
            <a href="#productos" className={styles.ctaButton}>
              + Empezar →
            </a>
          </div>
          <div className={styles.ctaImage}>
            <img
              src={products[0]?.images[0]}
              alt="Producto destacado"
              onError={e => { e.target.src = '/images/placeholder.jpg' }}
            />
          </div>
        </div>

        <section id="productos" className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>Nuestros sabores</h2>

          <div className={styles.filters}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
