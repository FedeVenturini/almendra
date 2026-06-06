import { useState, useEffect } from 'react'
import { categories } from '../../data/products'
import { useProducts } from '../../hooks/useProducts'
import { usePricing } from '../../context/PricingContext'
import ProductCard from '../../components/ProductCard/ProductCard'
import WholesaleModal from '../../components/WholesaleModal/WholesaleModal'
import styles from './Home.module.css'

const GROUPS = {
  dulce:  { label: '🍫 Dulce',  cats: ['alfajores', 'cookies', 'galletas'] },
  salado: { label: '🧀 Salado', cats: ['panes', 'chipas', 'marineras', 'quesitos', 'talitas'] },
}

export default function Home() {
  const [activeGroup, setActiveGroup] = useState('todos')
  const [activeCategory, setActiveCategory] = useState('todos')
  const [showWholesale, setShowWholesale] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselVisible, setCarouselVisible] = useState(true)
  const { products } = useProducts()
  const { mode, exitWholesale } = usePricing()

  const carouselImages = products.map(p => p.images[0]).filter(Boolean)

  useEffect(() => {
    if (carouselImages.length <= 1) return
    const interval = setInterval(() => {
      setCarouselVisible(false)
      setTimeout(() => {
        setCarouselIndex(i => (i + 1) % carouselImages.length)
        setCarouselVisible(true)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  const handleGroupClick = (group) => {
    setActiveGroup(group)
    setActiveCategory('todos')
  }

  const subCategories = activeGroup !== 'todos'
    ? categories.filter(c => GROUPS[activeGroup].cats.includes(c.id))
    : []

  const filtered = products.filter(p => {
    if (activeGroup !== 'todos' && activeCategory === 'todos')
      return GROUPS[activeGroup].cats.includes(p.category)
    if (activeCategory !== 'todos')
      return p.category === activeCategory
    return true
  })

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
              src={carouselImages[carouselIndex]}
              alt="Producto destacado"
              className={carouselVisible ? styles.carouselVisible : styles.carouselHidden}
              onError={e => { e.target.src = '/images/placeholder.jpg' }}
            />
          </div>
        </div>

        {mode === 'wholesale' ? (
          <div className={styles.wholesaleBadge}>
            🏪 Estás viendo precios mayoristas
            <button className={styles.exitWholesale} onClick={exitWholesale}>Salir</button>
          </div>
        ) : (
          <button className={styles.wholesaleBtn} onClick={() => setShowWholesale(true)}>
            ¿Sos revendedor? Accedé a precios mayoristas
          </button>
        )}

        <section id="productos" className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>Nuestros sabores</h2>

          {/* Nivel 1: Todos / Dulce / Salado */}
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${activeGroup === 'todos' ? styles.filterActive : ''}`}
              onClick={() => handleGroupClick('todos')}
            >Todos</button>
            {Object.entries(GROUPS).map(([key, g]) => (
              <button
                key={key}
                className={`${styles.filterBtn} ${activeGroup === key ? styles.filterActive : ''}`}
                onClick={() => handleGroupClick(key)}
              >{g.label}</button>
            ))}
          </div>

          {/* Nivel 2: subcategorías */}
          {subCategories.length > 0 && (
            <div className={styles.subFilters}>
              <button
                className={`${styles.subFilterBtn} ${activeCategory === 'todos' ? styles.subFilterActive : ''}`}
                onClick={() => setActiveCategory('todos')}
              >Todos</button>
              {subCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.subFilterBtn} ${activeCategory === cat.id ? styles.subFilterActive : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >{cat.label}</button>
              ))}
            </div>
          )}

          <div className={styles.grid}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>

      {showWholesale && <WholesaleModal onClose={() => setShowWholesale(false)} />}
    </div>
  )
}
