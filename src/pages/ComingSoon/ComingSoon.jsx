import styles from './ComingSoon.module.css'

const IG_URL = 'https://www.instagram.com/almendra.glutenfree'
const WA_URL = 'https://wa.me/543564349049'

export default function ComingSoon() {
  return (
    <div className={styles.page}>
      <div className={styles.imageWrapper}>
        <img src="/images/coming-soon.png" alt="Almendra - Próximamente" className={styles.image} />
        <a href={IG_URL} target="_blank" rel="noopener noreferrer" className={styles.hotspot} style={{ left: '31%', top: '87%', width: '5%', height: '8%' }} aria-label="Instagram" />
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className={styles.hotspot} style={{ left: '38%', top: '87%', width: '5%', height: '8%' }} aria-label="WhatsApp" />
      </div>
    </div>
  )
}
