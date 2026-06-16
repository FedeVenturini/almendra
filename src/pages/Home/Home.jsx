import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories } from '../../data/products'
import { useProducts } from '../../hooks/useProducts'
import { usePricing } from '../../context/PricingContext'
import ProductCard from '../../components/ProductCard/ProductCard'
import WholesaleModal from '../../components/WholesaleModal/WholesaleModal'
import InfoSection from '../../components/InfoSection/InfoSection'
import styles from './Home.module.css'

const GROUPS = [
  { id: 'todos',  label: 'Todos' },
  { id: 'dulce',  label: '🍫 Dulce' },
  { id: 'salado', label: '🧀 Salado' },
]

const BRANDS = [
  { id: 'todos',    label: 'Todas las marcas' },
  { id: 'almendra', label: '🌾 Almendra' },
  { id: 'otras',    label: '🏪 Otras marcas' },
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeGroup    = searchParams.get('grupo') || 'todos'
  const activeCategory = searchParams.get('cat')   || 'todos'
  const activeBrand    = searchParams.get('marca')  || 'todos'
  const search         = searchParams.get('q')      || ''

  const setActiveGroup = (v) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (!v || v === 'todos') next.delete('grupo'); else next.set('grupo', v)
      next.delete('cat')
      return next
    }, { replace: true })
  }

  const setActiveCategory = (v) => setSearchParams(prev => {
    const next = new URLSearchParams(prev)
    if (!v || v === 'todos') next.delete('cat'); else next.set('cat', v)
    return next
  }, { replace: true })

  const setActiveBrand = (v) => setSearchParams(prev => {
    const next = new URLSearchParams(prev)
    if (!v || v === 'todos') next.delete('marca'); else next.set('marca', v)
    return next
  }, { replace: true })

  const setSearch = (v) => setSearchParams(prev => {
    const next = new URLSearchParams(prev)
    if (!v) next.delete('q'); else next.set('q', v)
    return next
  }, { replace: true })
  const [showWholesale, setShowWholesale] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselVisible, setCarouselVisible] = useState(true)
  const { products } = useProducts()
  const { mode, exitWholesale } = usePricing()

  const carouselImages = products.map(p => p.images[0]).filter(img => img && !img.includes('card-revelando'))

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

  // Subcategories available for current group
  const groupProducts = activeGroup === 'todos'
    ? products
    : products.filter(p => p.group === activeGroup)

  const subCategoryIds = [...new Set(groupProducts.map(p => p.category))]
  const subCategories = categories.filter(c => c.id !== 'todos' && subCategoryIds.includes(c.id))

  const filtered = products.filter(p => {
    if (search.trim()) return p.name.toLowerCase().includes(search.toLowerCase())
    if (activeGroup !== 'todos' && p.group !== activeGroup) return false
    if (activeCategory !== 'todos' && p.category !== activeCategory) return false
    if (activeBrand !== 'todos' && p.brand !== activeBrand) return false
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

      <InfoSection />

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
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={styles.wholesaleBtn} onClick={() => setShowWholesale(true)}>
              🏪 ¿Sos revendedor? Accedé a precios <strong>mayoristas</strong>
            </button>
          </div>
        )}

        <section id="productos" className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>Nuestros sabores</h2>

          {/* Nivel 1: Todos / Dulce / Salado + buscador inline */}
          <div className={styles.filtersRow}>
            <div className={styles.filters}>
              {GROUPS.map(g => (
                <button
                  key={g.id}
                  className={`${styles.filterBtn} ${activeGroup === g.id ? styles.filterActive : ''}`}
                  onClick={() => setActiveGroup(g.id)}
                >{g.label}</button>
              ))}
            </div>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>
              )}
            </div>
          </div>

          {/* Nivel 2 y 3: solo cuando hay grupo seleccionado */}
          {activeGroup !== 'todos' && (
            <>
              {subCategories.length > 0 && (
                <div className={styles.subFilters}>
                  <button
                    className={`${styles.subFilterBtn} ${activeCategory === 'todos' ? styles.subFilterActive : ''}`}
                    onClick={() => setActiveCategory('todos')}
                  >Todas</button>
                  {subCategories.map(cat => (
                    <button
                      key={cat.id}
                      className={`${styles.subFilterBtn} ${activeCategory === cat.id ? styles.subFilterActive : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >{cat.label}</button>
                  ))}
                </div>
              )}

              <div className={styles.brandFilters}>
                {BRANDS.map(b => (
                  <button
                    key={b.id}
                    className={`${styles.brandFilterBtn} ${activeBrand === b.id ? styles.brandFilterActive : ''}`}
                    onClick={() => setActiveBrand(b.id)}
                  >{b.label}</button>
                ))}
              </div>
            </>
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
