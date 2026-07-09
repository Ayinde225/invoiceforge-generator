import { uid } from './storage.js'

export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar ($)', locale: 'en-US' },
  { code: 'EUR', label: 'Euro (€)', locale: 'de-DE' },
  { code: 'GBP', label: 'British Pound (£)', locale: 'en-GB' },
  { code: 'NGN', label: 'Nigerian Naira (₦)', locale: 'en-NG' },
  { code: 'CAD', label: 'Canadian Dollar (C$)', locale: 'en-CA' },
  { code: 'AUD', label: 'Australian Dollar (A$)', locale: 'en-AU' },
  { code: 'JPY', label: 'Japanese Yen (¥)', locale: 'ja-JP' },
  { code: 'INR', label: 'Indian Rupee (₹)', locale: 'en-IN' },
]

export function localeFor(code) {
  return CURRENCIES.find((c) => c.code === code)?.locale ?? 'en-US'
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function inDays(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function emptyItem() {
  return { id: uid(), description: '', quantity: 1, unitPrice: 0 }
}

export function newInvoice() {
  return {
    id: uid(),
    number: `INV-${new Date().getFullYear()}-001`,
    issueDate: today(),
    dueDate: inDays(14),
    currency: 'USD',
    sender: {
      name: 'Your Business Name',
      email: '',
      address: '',
      phone: '',
    },
    client: {
      name: '',
      email: '',
      address: '',
    },
    items: [
      { id: uid(), description: 'Consulting services', quantity: 10, unitPrice: 75 },
    ],
    discount: { type: 'percent', value: 0 },
    taxRate: 0,
    notes: 'Payment due within 14 days. Thank you for your business!',
  }
}
