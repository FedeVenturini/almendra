import styles from './ComingSoon.module.css'

export default function ComingSoon() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img
          src="/images/logo.png"
          alt="Almendra"
          className={styles.logo}
          onError={e => { e.target.style.display = 'none' }}
        />
        <h1 className={styles.title}>Estamos construyendo algo hermoso</h1>
        <p className={styles.text}>
          para que puedas elegir los mejores productos sin gluten
        </p>
        <div className={styles.divider} />
        <p className={styles.sub}>Muy pronto 🌾</p>
      </div>
    </div>
  )
}
