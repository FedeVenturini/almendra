import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Drawer from '../Drawer/Drawer'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { count } = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <button className={styles.hamburger} onClick={() => setDrawerOpen(true)} aria-label="Menú">
            <span /><span /><span />
          </button>

          <Link to="/" className={styles.logo}>
            <img src="/images/Logo.png" alt="Almendra" className={styles.logoImg} onError={e => { e.target.style.display = 'none' }} />
          </Link>

          <Link to="/carrito" className={styles.cartLink}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </Link>
        </nav>
      </header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
