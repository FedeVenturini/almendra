import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { supabase, updateProductCatalog } from '../../lib/supabase'
import { products as staticProducts } from '../../data/products'
import styles from './Admin.module.css'

const ADMIN_PASSWORD = 'almendra2024'

function toLocalDateString(date) {
  return date.toISOString().split('T')[0]
}

function getRangeForPreset(preset) {
  const now = new Date()
  const today = toLocalDateString(now)
  if (preset === 'week') {
    const day = now.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const monday = new Date(now)
    monday.setDate(now.getDate() + diff)
    return { from: toLocalDateString(monday), to: today }
  }
  if (preset === 'month') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
    return { from: toLocalDateString(first), to: today }
  }
  return null
}

function downloadPriceTemplate(catalogWithNames) {
  const rows = catalogWithNames.map(p => ({
    id: p.id,
    Producto: p.name,
    'Precio Minorista': p.price,
    'Precio Mayorista': p.wholesale_price,
    Stock: p.stock,
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [{ wch: 24 }, { wch: 30 }, { wch: 18 }, { wch: 18 }, { wch: 10 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Precios')
  XLSX.writeFile(wb, 'almendra-precios.xlsx')
}

async function importPricesFromExcel(file) {
  const buffer = await file.arrayBuffer()
  const wb = XLSX.read(buffer)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(ws)

  const results = { ok: 0, errors: [] }
  for (const row of rows) {
    const id = row['id']
    const price = Number(row['Precio Minorista'])
    const wholesale_price = Number(row['Precio Mayorista'])
    const stock = Number(row['Stock'])
    if (!id) continue
    if (isNaN(price) || isNaN(wholesale_price) || isNaN(stock)) {
      results.errors.push(id)
      continue
    }
    try {
      await updateProductCatalog(id, { price, wholesale_price, stock })
      results.ok++
    } catch {
      results.errors.push(id)
    }
  }
  return results
}

function buildSummary(orders) {
  return orders.reduce((acc, order) => {
    order.items.forEach(item => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity
    })
    return acc
  }, {})
}

function exportToExcel(orders, dateLabel) {
  // Compradores únicos (columnas)
  const buyers = [...new Set(orders.map(o => o.customer_name))]

  // Pivot: data[producto][comprador] = cantidad
  const pivot = {}
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!pivot[item.name]) pivot[item.name] = {}
      pivot[item.name][order.customer_name] = (pivot[item.name][order.customer_name] || 0) + item.quantity
    })
  })

  // Solo productos con total > 0
  const productNames = Object.keys(pivot).filter(p =>
    Object.values(pivot[p]).reduce((a, b) => a + b, 0) > 0
  )

  // Encabezado
  const header = ['Producto', ...buyers, 'TOTAL']

  // Filas de productos
  const rows = productNames.map(product => {
    let rowTotal = 0
    const cells = buyers.map(buyer => {
      const qty = pivot[product][buyer] || 0
      rowTotal += qty
      return qty > 0 ? qty : ''
    })
    return [product, ...cells, rowTotal]
  })

  // Fila totalizadora
  const totalsRow = ['TOTAL']
  let grandTotal = 0
  buyers.forEach(buyer => {
    const buyerTotal = productNames.reduce((sum, p) => sum + (pivot[p][buyer] || 0), 0)
    totalsRow.push(buyerTotal)
    grandTotal += buyerTotal
  })
  totalsRow.push(grandTotal)

  // Armar hoja
  const sheetData = [header, ...rows, totalsRow]
  const ws = XLSX.utils.aoa_to_sheet(sheetData)

  // Ancho de columnas automático
  ws['!cols'] = header.map((_, i) => ({ wch: i === 0 ? 28 : 14 }))

  // Estilo de la fila de totales (negrita) — SheetJS Community no soporta estilos ricos,
  // pero el totalizador queda en la última fila claramente identificado

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Pedidos')
  XLSX.writeFile(wb, `almendra-pedidos-${dateLabel}.xlsx`)
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [tab, setTab] = useState('pedidos')

  // Pedidos
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [preset, setPreset] = useState('week')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  // Productos
  const [catalog, setCatalog] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(false)
  const [editing, setEditing] = useState({})
  const [saving, setSaving] = useState({})
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  const login = e => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { setAuthed(true); setLoginError(null) }
    else setLoginError('Contraseña incorrecta')
  }

  useEffect(() => {
    if (!authed) return
    setOrdersLoading(true)
    supabase.from('orders').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setOrdersLoading(false) })

    setCatalogLoading(true)
    supabase.from('product_catalog').select('*')
      .then(({ data }) => { setCatalog(data || []); setCatalogLoading(false) })
  }, [authed])

  const activeRange = preset === 'custom'
    ? { from: customFrom, to: customTo }
    : getRangeForPreset(preset)

  const filteredOrders = orders.filter(o => {
    if (!activeRange?.from || !activeRange?.to) return true
    const date = o.created_at.split('T')[0]
    return date >= activeRange.from && date <= activeRange.to
  })

  const summary = buildSummary(filteredOrders)

  const catalogWithNames = staticProducts.map(p => {
    const row = catalog.find(r => r.id === p.id) || { price: 0, wholesale_price: 0, stock: 0 }
    return { ...p, price: row.price, wholesale_price: row.wholesale_price, stock: row.stock }
  })

  const startEdit = (id, field, value) => {
    setEditing(e => ({ ...e, [`${id}-${field}`]: String(value) }))
  }

  const handleEditChange = (id, field, value) => {
    setEditing(e => ({ ...e, [`${id}-${field}`]: value }))
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    setImportResult(null)
    const results = await importPricesFromExcel(file)
    // Recargar catálogo desde Supabase
    const { data } = await supabase.from('product_catalog').select('*')
    setCatalog(data || [])
    setImporting(false)
    setImportResult(results)
    e.target.value = ''
  }

  const saveField = async (id, field) => {
    const key = `${id}-${field}`
    const value = Number(editing[key])
    if (isNaN(value)) return
    setSaving(s => ({ ...s, [key]: true }))
    await updateProductCatalog(id, { [field]: value })
    setCatalog(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
    setEditing(e => { const n = { ...e }; delete n[key]; return n })
    setSaving(s => { const n = { ...s }; delete n[key]; return n })
  }

  if (!authed) return (
    <div className={styles.loginPage}>
      <form onSubmit={login} className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Panel Admin</h2>
        <input
          className={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {loginError && <p className={styles.error}>{loginError}</p>}
        <button className={styles.loginBtn} type="submit">Entrar</button>
      </form>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Panel Admin</h1>
        <Link to="/" className={styles.exitBtn}>← Ver tienda</Link>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${tab === 'pedidos' ? styles.tabActive : ''}`} onClick={() => setTab('pedidos')}>Pedidos</button>
        <button className={`${styles.tabBtn} ${tab === 'productos' ? styles.tabActive : ''}`} onClick={() => setTab('productos')}>Productos</button>
      </div>

      {tab === 'pedidos' && (
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <p className={styles.sidebarTitle}>Período</p>
            <button className={`${styles.presetBtn} ${preset === 'week' ? styles.presetActive : ''}`} onClick={() => setPreset('week')}>Última semana</button>
            <button className={`${styles.presetBtn} ${preset === 'month' ? styles.presetActive : ''}`} onClick={() => setPreset('month')}>Último mes</button>
            <button className={`${styles.presetBtn} ${preset === 'custom' ? styles.presetActive : ''}`} onClick={() => setPreset('custom')}>Personalizado</button>
            {preset === 'custom' && (
              <div className={styles.customRange}>
                <label className={styles.rangeLabel}>
                  Desde
                  <input type="date" className={styles.dateInput} value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
                </label>
                <label className={styles.rangeLabel}>
                  Hasta
                  <input type="date" className={styles.dateInput} value={customTo} onChange={e => setCustomTo(e.target.value)} />
                </label>
              </div>
            )}
          </aside>

          <div className={styles.main}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Resumen — {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
                </h2>
                <button
                  className={styles.exportBtn}
                  onClick={() => exportToExcel(filteredOrders, activeRange?.from || 'periodo')}
                  disabled={filteredOrders.length === 0}
                >
                  ↓ Exportar Excel
                </button>
              </div>
              {Object.keys(summary).length === 0
                ? <p className={styles.empty}>Sin pedidos en este período.</p>
                : (
                  <ul className={styles.summaryList}>
                    {Object.entries(summary).map(([name, qty]) => (
                      <li key={name} className={styles.summaryItem}>
                        <span>{name}</span>
                        <span className={styles.summaryQty}>{qty} u.</span>
                      </li>
                    ))}
                  </ul>
                )
              }
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Pedidos</h2>
              {ordersLoading && <p className={styles.empty}>Cargando...</p>}
              {filteredOrders.length === 0 && !ordersLoading && <p className={styles.empty}>No hay pedidos en este período.</p>}
              {filteredOrders.map(order => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <div className={styles.orderNameRow}>
                        <p className={styles.orderName}>{order.customer_name}</p>
                        <span className={`${styles.modeBadge} ${order.pricing_mode === 'wholesale' ? styles.modeBadgeWholesale : styles.modeBadgeRetail}`}>
                          {order.pricing_mode === 'wholesale' ? 'Mayorista' : 'Minorista'}
                        </span>
                      </div>
                      <p className={styles.orderContact}>{order.customer_whatsapp} · {order.customer_email}</p>
                    </div>
                    <div className={styles.orderMeta}>
                      <p className={styles.orderDate}>
                        {new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </p>
                      {order.total > 0 && <p className={styles.orderTotal}>${order.total.toLocaleString('es-AR')}</p>}
                    </div>
                  </div>
                  <ul className={styles.orderItems}>
                    {order.items.map((item, i) => (
                      <li key={i} className={styles.orderItem}>
                        {item.name} <span>x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>
        </div>
      )}

      {tab === 'productos' && (
        <div>
          {/* Barra de importación/exportación */}
          <div className={styles.importBar}>
            <button
              className={styles.templateBtn}
              onClick={() => downloadPriceTemplate(catalogWithNames)}
            >
              ↓ Descargar plantilla
            </button>

            <label className={`${styles.importBtn} ${importing ? styles.importBtnLoading : ''}`}>
              {importing ? 'Importando...' : '↑ Importar Excel'}
              <input
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={handleImport}
                disabled={importing}
              />
            </label>
          </div>

          {importResult && (
            <div className={importResult.errors.length ? styles.importError : styles.importSuccess}>
              {importResult.errors.length === 0
                ? `✓ ${importResult.ok} productos actualizados correctamente.`
                : `✓ ${importResult.ok} actualizados. Error en: ${importResult.errors.join(', ')}`
              }
            </div>
          )}

        <div className={styles.productTable}>
          <div className={styles.productTableHeader}>
            <span>Producto</span>
            <span className={styles.colCenter}>Minorista</span>
            <span className={styles.colCenter}>Mayorista</span>
            <span className={styles.colCenter}>Stock</span>
          </div>
          {catalogLoading && <p className={styles.empty}>Cargando...</p>}
          {catalogWithNames.map(p => {
            const priceKey = `${p.id}-price`
            const wholesaleKey = `${p.id}-wholesale_price`
            const stockKey = `${p.id}-stock`
            return (
              <div key={p.id} className={styles.productRow}>
                <span className={styles.productName}>{p.name}</span>

                <div className={styles.colCenter}>
                  {priceKey in editing ? (
                    <div className={styles.editCell}>
                      <input className={styles.editInput} type="number" min="0" value={editing[priceKey]}
                        onChange={e => handleEditChange(p.id, 'price', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveField(p.id, 'price')} autoFocus />
                      <button className={styles.saveBtn} onClick={() => saveField(p.id, 'price')} disabled={saving[priceKey]}>
                        {saving[priceKey] ? '...' : '✓'}
                      </button>
                    </div>
                  ) : (
                    <button className={styles.fieldBtn} onClick={() => startEdit(p.id, 'price', p.price)}>
                      {p.price > 0 ? `$${p.price.toLocaleString('es-AR')}` : '— Agregar'}
                    </button>
                  )}
                </div>

                <div className={styles.colCenter}>
                  {wholesaleKey in editing ? (
                    <div className={styles.editCell}>
                      <input className={styles.editInput} type="number" min="0" value={editing[wholesaleKey]}
                        onChange={e => handleEditChange(p.id, 'wholesale_price', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveField(p.id, 'wholesale_price')} autoFocus />
                      <button className={styles.saveBtn} onClick={() => saveField(p.id, 'wholesale_price')} disabled={saving[wholesaleKey]}>
                        {saving[wholesaleKey] ? '...' : '✓'}
                      </button>
                    </div>
                  ) : (
                    <button className={styles.fieldBtn} onClick={() => startEdit(p.id, 'wholesale_price', p.wholesale_price)}>
                      {p.wholesale_price > 0 ? `$${p.wholesale_price.toLocaleString('es-AR')}` : '— Agregar'}
                    </button>
                  )}
                </div>

                <div className={styles.colCenter}>
                  {stockKey in editing ? (
                    <div className={styles.editCell}>
                      <input className={styles.editInput} type="number" min="0" value={editing[stockKey]}
                        onChange={e => handleEditChange(p.id, 'stock', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveField(p.id, 'stock')} autoFocus />
                      <button className={styles.saveBtn} onClick={() => saveField(p.id, 'stock')} disabled={saving[stockKey]}>
                        {saving[stockKey] ? '...' : '✓'}
                      </button>
                    </div>
                  ) : (
                    <button className={`${styles.fieldBtn} ${p.stock === 0 ? styles.noStock : ''}`} onClick={() => startEdit(p.id, 'stock', p.stock)}>
                      {p.stock} u.
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        </div>
      )}
    </div>
  )
}
