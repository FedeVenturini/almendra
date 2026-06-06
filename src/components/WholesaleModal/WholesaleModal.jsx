import { useState } from 'react'
import { usePricing } from '../../context/PricingContext'
import styles from './WholesaleModal.module.css'

function EyeIcon({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

export default function WholesaleModal({ onClose }) {
  const { unlockWholesale } = usePricing()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

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
          <div className={styles.inputWrap}>
            <input
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              type={showPwd ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              autoFocus
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(v => !v)}>
              <EyeIcon open={showPwd} />
            </button>
          </div>
          {error && <p className={styles.error}>Contraseña incorrecta</p>}
          <button className={styles.submitBtn} type="submit">Ingresar</button>
        </form>
        <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  )
}
