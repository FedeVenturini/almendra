import styles from './ComingSoon.module.css'

const IG_URL = 'https://www.instagram.com/almendra.singluten/'
const WA_URL = 'https://wa.me/543564349049'

export default function ComingSoon() {
  return (
    <div className={styles.page}>
      <div className={styles.imageWrapper}>
        <img src="/images/coming-soon.png" alt="Almendra - Próximamente" className={styles.image} />
        {/* Posiciones calculadas sobre imagen 1536x984 */}
        <a href={IG_URL} target="_blank" rel="noopener noreferrer" className={styles.hotspot}
          style={{ left: '30%', top: '85%', width: '4.5%', height: '6.5%' }}
          aria-label="Instagram" />
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={styles.hotspot}
          style={{ left: '36.5%', top: '85%', width: '4.5%', height: '6.5%' }}
          aria-label="WhatsApp" />
      </div>
    </div>
  )
}
