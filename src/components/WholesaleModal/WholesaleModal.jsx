import { useState } from 'react'
import { usePricing } from '../../context/PricingContext'
import styles from './WholesaleModal.module.css'

export default function WholesaleModal({ onClose }) {
  const { unlockWholesale } = usePricing()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = unlockWholesale(password)
    if (ok) {
      onClose()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>Acceso mayorista</h2>
        <p className={styles.subtitle}>Ingresá tu contraseña para ver los precios mayoristas</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            autoFocus
          />
          {error && <p className={styles.error}>Contraseña incorrecta</p>}
          <button className={styles.submitBtn} type="submit">Ingresar</button>
        </form>
        <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  )
}
