// Pure calculation helpers for InvoiceForge.
// All monetary values are handled as numbers and rounded to 2 decimals
// only at the boundaries where a final figure is produced.

/**
 * Round a number to 2 decimal places, avoiding common floating point
 * artefacts (e.g. 1.005 -> 1.01). Returns 0 for non-finite input.
 */
export function round2(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  // Nudge by Number.EPSILON scaled to the value to fix boundary rounding.
  return Math.round((n + Number.EPSILON * Math.sign(n)) * 100) / 100
}

/** Coerce a possibly-empty/invalid input into a finite number (default 0). */
export function toNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Total for a single line item: quantity * unitPrice, rounded to 2dp.
 */
export function lineTotal(item) {
  const qty = toNumber(item?.quantity)
  const price = toNumber(item?.unitPrice)
  return round2(qty * price)
}

/**
 * Subtotal across all line items (sum of rounded line totals).
 */
export function subtotal(items) {
  if (!Array.isArray(items)) return 0
  const sum = items.reduce((acc, item) => acc + lineTotal(item), 0)
  return round2(sum)
}

/**
 * Discount amount given a base (subtotal).
 * type 'percent' -> value is a percentage of the base.
 * type 'flat'    -> value is an absolute amount.
 * The discount never exceeds the base and is never negative.
 */
export function discountAmount(base, discount) {
  const b = toNumber(base)
  const value = toNumber(discount?.value)
  const type = discount?.type === 'percent' ? 'percent' : 'flat'
  let amount = type === 'percent' ? (b * value) / 100 : value
  if (amount < 0) amount = 0
  if (amount > b) amount = b
  return round2(amount)
}

/**
 * Taxable amount = subtotal - discount (never below zero).
 */
export function taxableAmount(base, discount) {
  const b = toNumber(base)
  const amount = b - discountAmount(b, discount)
  return round2(Math.max(0, amount))
}

/**
 * Tax amount computed on the discounted (taxable) base.
 */
export function taxAmount(base, discount, taxRate) {
  const taxable = taxableAmount(base, discount)
  const rate = toNumber(taxRate)
  return round2((taxable * rate) / 100)
}

/**
 * Grand total = taxable amount + tax.
 */
export function grandTotal(base, discount, taxRate) {
  const taxable = taxableAmount(base, discount)
  const tax = taxAmount(base, discount, taxRate)
  return round2(taxable + tax)
}

/**
 * Compute every derived figure for an invoice in one pass.
 */
export function computeTotals(invoice) {
  const items = invoice?.items ?? []
  const discount = invoice?.discount ?? { type: 'percent', value: 0 }
  const taxRate = invoice?.taxRate ?? 0
  const sub = subtotal(items)
  return {
    subtotal: sub,
    discount: discountAmount(sub, discount),
    taxable: taxableAmount(sub, discount),
    tax: taxAmount(sub, discount, taxRate),
    total: grandTotal(sub, discount, taxRate),
  }
}

/**
 * Format a number as currency using Intl.NumberFormat.
 * Falls back to a safe format if the currency code is invalid.
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  const n = toNumber(amount)
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(n)
  } catch {
    return `${currency} ${round2(n).toFixed(2)}`
  }
}
