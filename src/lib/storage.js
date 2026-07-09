// Thin localStorage wrapper for persisting saved invoices.

const KEY = 'invoiceforge.saved'

export function loadInvoices() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function persistInvoices(invoices) {
  try {
    localStorage.setItem(KEY, JSON.stringify(invoices))
  } catch {
    // Storage full or unavailable — fail silently.
  }
}

export function uid() {
  return `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
