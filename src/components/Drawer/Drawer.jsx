import styles from './Drawer.module.css'

export default function Drawer({ open, onClose }) {
  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`} onClick={onClose} />

      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>

        <div className={styles.logoWrap}>
          <img src="/images/Logo.png" alt="Almendra" className={styles.logo} />
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>El negocio</h3>
          <p className={styles.text}>
            {/* El dueño va a pasar la descripción */}
            Panadería artesanal sin gluten, elaborada con amor y los mejores ingredientes.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Horarios</h3>
          <div className={styles.hours}>
            {/* El dueño va a pasar los horarios */}
            <div className={styles.hourRow}>
              <span>Lunes a viernes</span>
              <span>–</span>
            </div>
            <div className={styles.hourRow}>
              <span>Sábados</span>
              <span>–</span>
            </div>
            <div className={styles.hourRow}>
              <span>Domingos</span>
              <span>–</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Encontranos</h3>
          <a
            href="https://www.instagram.com/almendra.singluten/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
            @almendra.singluten
          </a>
          <a
            href="https://wa.me/543564349049"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
            3564 349049
          </a>
          <p className={styles.address}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            General Paz 133, Devoto, Córdoba
          </p>
        </section>
      </aside>
    </>
  )
}
