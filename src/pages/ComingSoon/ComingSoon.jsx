import styles from './ComingSoon.module.css'

export default function ComingSoon() {
  return (
    <div className={styles.page}>
      <div className={styles.imageWrapper}>
        <img src="/images/coming-soon.png" alt="Almendra - Próximamente" className={styles.image} />
      </div>
    </div>
  )
}
