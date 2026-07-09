import { useEffect, useMemo, useState } from 'react'
import Editor from './components/Editor.jsx'
import Preview from './components/Preview.jsx'
import SavedList from './components/SavedList.jsx'
import { newInvoice, emptyItem, localeFor } from './lib/defaults.js'
import { loadInvoices, persistInvoices, uid } from './lib/storage.js'

export default function App() {
  const [invoice, setInvoice] = useState(newInvoice)
  const [saved, setSaved] = useState(() => loadInvoices())
  const [flash, setFlash] = useState('')

  useEffect(() => {
    persistInvoices(saved)
  }, [saved])

  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(''), 2200)
    return () => clearTimeout(t)
  }, [flash])

  const locale = useMemo(() => localeFor(invoice.currency), [invoice.currency])

  const update = (patch) => setInvoice((prev) => ({ ...prev, ...patch }))
  const updateNested = (key, patch) =>
    setInvoice((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))

  const itemHandlers = {
    change: (id, patch) =>
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      })),
    add: () =>
      setInvoice((prev) => ({ ...prev, items: [...prev.items, emptyItem()] })),
    remove: (id) =>
      setInvoice((prev) => ({
        ...prev,
        items:
          prev.items.length > 1
            ? prev.items.filter((it) => it.id !== id)
            : prev.items,
      })),
  }

  const handleSave = () => {
    setSaved((prev) => {
      const exists = prev.some((i) => i.id === invoice.id)
      const snapshot = { ...invoice, savedAt: Date.now() }
      return exists
        ? prev.map((i) => (i.id === invoice.id ? snapshot : i))
        : [snapshot, ...prev]
    })
    setFlash('Invoice saved')
  }

  const handleNew = () => {
    setInvoice(newInvoice())
    setFlash('Started a new invoice')
  }

  const handleLoad = (id) => {
    const found = saved.find((i) => i.id === id)
    if (found) {
      setInvoice(structuredCloneSafe(found))
      setFlash('Invoice loaded')
    }
  }

  const handleDuplicate = (id) => {
    const found = saved.find((i) => i.id === id)
    if (!found) return
    const copy = {
      ...structuredCloneSafe(found),
      id: uid(),
      number: `${found.number}-COPY`,
      savedAt: Date.now(),
    }
    setSaved((prev) => [copy, ...prev])
    setInvoice(copy)
    setFlash('Invoice duplicated')
  }

  const handleDelete = (id) => {
    setSaved((prev) => prev.filter((i) => i.id !== id))
    setFlash('Invoice deleted')
  }

  const handlePrint = () => window.print()

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">$</span>
          <div>
            <span className="brand-name">InvoiceForge</span>
            <span className="brand-tag">Invoice generator</span>
          </div>
        </div>
        <div className="topbar-actions">
          <button type="button" className="btn btn-ghost" onClick={handleNew}>
            New
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleSave}>
            Save
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            Download / Print PDF
          </button>
        </div>
      </header>

      {flash && <div className="flash">{flash}</div>}

      <main className="layout">
        <div className="col-editor">
          <Editor
            invoice={invoice}
            locale={locale}
            update={update}
            updateNested={updateNested}
            itemHandlers={itemHandlers}
          />

          <section className="card">
            <h2 className="card-title">Saved invoices</h2>
            <SavedList
              saved={saved}
              currentId={invoice.id}
              onLoad={handleLoad}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </section>
        </div>

        <div className="col-preview">
          <div className="preview-scroll">
            <Preview invoice={invoice} locale={locale} />
          </div>
        </div>
      </main>

      <footer className="app-footer no-print">
        Built with React + Vite ·{' '}
        <a href="https://github.com/Ayinde225/invoiceforge-generator">Source on GitHub</a>
      </footer>
    </div>
  )
}

// Fallback for environments without structuredClone.
function structuredCloneSafe(obj) {
  if (typeof structuredClone === 'function') return structuredClone(obj)
  return JSON.parse(JSON.stringify(obj))
}
