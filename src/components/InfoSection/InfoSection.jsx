import { useState } from 'react'
import styles from './InfoSection.module.css'

const MODALS = {
  faq: {
    title: 'Preguntas frecuentes',
    content: [
      {
        q: '¿Los productos son aptos para celíacos?',
        a: 'Sí. Todos nuestros productos son elaborados sin TACC (trigo, avena, cebada y centeno) y están pensados para personas celíacas o con sensibilidad al gluten.',
      },
      {
        q: '¿Cómo hago un pedido?',
        a: 'Elegís los productos, los agregás al carrito y completás el formulario con tu nombre, WhatsApp y mail. Te contactamos para confirmar y coordinar la entrega.',
      },
      {
        q: '¿Cuánto tiempo tarda el pedido?',
        a: 'Los pedidos se preparan de forma artesanal. Coordinaremos el tiempo de entrega al confirmar tu pedido por WhatsApp.',
      },
      {
        q: '¿Se pueden congelar los productos?',
        a: 'Sí, la mayoría de nuestros productos se pueden congelar perfectamente. Te recomendamos consultarnos al momento del pedido para cada caso.',
      },
    ],
  },
  noDevoto: {
    title: '¿No sos de Devoto?',
    content: null,
    text: 'Aunque somos de Devoto, podemos coordinar envíos o puntos de encuentro para otras zonas. Escribinos por WhatsApp y buscamos la mejor opción para vos.\n\nTambién contamos con compradores mayoristas en distintas localidades. Si te interesa revender nuestros productos, entrá al modo mayorista desde la página principal.',
    cta: {
      label: '💬 Escribinos por WhatsApp',
      href: 'https://wa.me/543564349049?text=Hola!%20Quiero%20consultar%20sobre%20env%C3%ADos%20fuera%20de%20Devoto',
    },
  },
  howItWorks: {
    title: '¿Cómo funciona el pedido?',
    content: null,
    steps: [
      { num: '1', label: 'Explorás los productos', desc: 'Recorrés la tienda, filtrás por dulce o salado y vas armando tu carrito.' },
      { num: '2', label: 'Cerrás el carrito', desc: 'Cuando tenés todo, vas al carrito y completás el formulario con tu nombre, WhatsApp y mail.' },
      { num: '3', label: 'Te contactamos', desc: 'Recibimos tu pedido y te escribimos por WhatsApp para confirmar el total y coordinar el día de retiro o entrega.' },
      { num: '4', label: '¡Disfrutás!', desc: 'Recibís tus productos frescos y listos para comer o congelar.' },
    ],
  },
}

export default function InfoSection() {
  const [open, setOpen] = useState(null)

  const modal = open ? MODALS[open] : null

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon}>🌾</span>
          <div>
            <h2 className={styles.cardTitle}>Quiénes somos</h2>
            <p className={styles.cardText}>
              Somos una panadería artesanal sin TACC de Devoto, Entre Ríos. Elaboramos cada producto con amor y cuidado, pensando en quienes necesitan comer rico sin gluten.
            </p>
          </div>
        </div>
        <div className={styles.btnRow}>
          <button className={styles.infoBtn} onClick={() => setOpen('faq')}>
            🙋 Preguntas frecuentes
          </button>
          <button className={styles.infoBtn} onClick={() => setOpen('noDevoto')}>
            📍 ¿No sos de Devoto?
          </button>
          <button className={styles.infoBtn} onClick={() => setOpen('howItWorks')}>
            🛒 ¿Cómo funciona el pedido?
          </button>
        </div>
      </div>

      {modal && (
        <div className={styles.overlay} onClick={() => setOpen(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{modal.title}</h3>
              <button className={styles.closeBtn} onClick={() => setOpen(null)}>✕</button>
            </div>

            {/* FAQ */}
            {open === 'faq' && (
              <div className={styles.faqList}>
                {modal.content.map((item, i) => (
                  <div key={i} className={styles.faqItem}>
                    <p className={styles.faqQ}>{item.q}</p>
                    <p className={styles.faqA}>{item.a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* No Devoto */}
            {open === 'noDevoto' && (
              <div className={styles.textBlock}>
                {modal.text.split('\n\n').map((p, i) => (
                  <p key={i} className={styles.modalText}>{p}</p>
                ))}
                <a href={modal.cta.href} target="_blank" rel="noopener noreferrer" className={styles.modalCta}>
                  {modal.cta.label}
                </a>
              </div>
            )}

            {/* Cómo funciona */}
            {open === 'howItWorks' && (
              <div className={styles.stepsList}>
                {modal.steps.map((step, i) => (
                  <div key={i} className={styles.step}>
                    <div className={styles.stepNum}>{step.num}</div>
                    <div>
                      <p className={styles.stepLabel}>{step.label}</p>
                      <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
