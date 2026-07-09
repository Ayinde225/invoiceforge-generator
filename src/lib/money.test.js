import { describe, it, expect } from 'vitest'
import {
  round2,
  toNumber,
  lineTotal,
  subtotal,
  discountAmount,
  taxableAmount,
  taxAmount,
  grandTotal,
  computeTotals,
  formatCurrency,
} from './money.js'

describe('round2', () => {
  it('rounds to two decimals', () => {
    expect(round2(1.005)).toBe(1.01)
    expect(round2(2.675)).toBe(2.68)
    expect(round2(1.234)).toBe(1.23)
  })

  it('returns 0 for non-finite input', () => {
    expect(round2(NaN)).toBe(0)
    expect(round2(Infinity)).toBe(0)
    expect(round2('abc')).toBe(0)
  })
})

describe('toNumber', () => {
  it('coerces valid numeric strings', () => {
    expect(toNumber('42.5')).toBe(42.5)
  })
  it('falls back for empty or invalid input', () => {
    expect(toNumber('')).toBe(0)
    expect(toNumber('nope', 7)).toBe(7)
    expect(toNumber(null)).toBe(0)
  })
})

describe('lineTotal', () => {
  it('multiplies quantity by unit price', () => {
    expect(lineTotal({ quantity: 3, unitPrice: 10 })).toBe(30)
  })
  it('rounds the result to 2 decimals', () => {
    expect(lineTotal({ quantity: 3, unitPrice: 0.335 })).toBe(1.01)
  })
  it('treats missing fields as zero', () => {
    expect(lineTotal({})).toBe(0)
    expect(lineTotal({ quantity: 5 })).toBe(0)
  })
})

describe('subtotal', () => {
  it('sums all line totals', () => {
    const items = [
      { quantity: 2, unitPrice: 50 }, // 100
      { quantity: 1, unitPrice: 25.5 }, // 25.5
      { quantity: 3, unitPrice: 10 }, // 30
    ]
    expect(subtotal(items)).toBe(155.5)
  })
  it('returns 0 for empty or invalid input', () => {
    expect(subtotal([])).toBe(0)
    expect(subtotal(null)).toBe(0)
  })
})

describe('discountAmount', () => {
  it('computes a percentage discount', () => {
    expect(discountAmount(200, { type: 'percent', value: 10 })).toBe(20)
  })
  it('computes a flat discount', () => {
    expect(discountAmount(200, { type: 'flat', value: 30 })).toBe(30)
  })
  it('never exceeds the base', () => {
    expect(discountAmount(50, { type: 'flat', value: 80 })).toBe(50)
    expect(discountAmount(50, { type: 'percent', value: 150 })).toBe(50)
  })
  it('never goes negative', () => {
    expect(discountAmount(100, { type: 'flat', value: -20 })).toBe(0)
  })
})

describe('taxableAmount', () => {
  it('subtracts the discount from the base', () => {
    expect(taxableAmount(200, { type: 'percent', value: 10 })).toBe(180)
  })
  it('never drops below zero', () => {
    expect(taxableAmount(100, { type: 'flat', value: 500 })).toBe(0)
  })
})

describe('taxAmount', () => {
  it('applies tax to the discounted base', () => {
    // subtotal 200, 10% discount => 180 taxable, 20% tax => 36
    expect(taxAmount(200, { type: 'percent', value: 10 }, 20)).toBe(36)
  })
  it('is zero when tax rate is zero', () => {
    expect(taxAmount(200, { type: 'flat', value: 0 }, 0)).toBe(0)
  })
})

describe('grandTotal', () => {
  it('adds tax to the taxable amount', () => {
    // 200 - 10% = 180, + 20% tax = 216
    expect(grandTotal(200, { type: 'percent', value: 10 }, 20)).toBe(216)
  })
  it('handles flat discount and VAT together', () => {
    // 155.5 - 5.5 flat = 150, + 8% = 162
    expect(grandTotal(155.5, { type: 'flat', value: 5.5 }, 8)).toBe(162)
  })
})

describe('computeTotals', () => {
  it('produces every derived figure in one pass', () => {
    const invoice = {
      items: [
        { quantity: 2, unitPrice: 50 },
        { quantity: 1, unitPrice: 100 },
      ],
      discount: { type: 'percent', value: 10 },
      taxRate: 20,
    }
    expect(computeTotals(invoice)).toEqual({
      subtotal: 200,
      discount: 20,
      taxable: 180,
      tax: 36,
      total: 216,
    })
  })

  it('uses sensible defaults when fields are absent', () => {
    expect(computeTotals({})).toEqual({
      subtotal: 0,
      discount: 0,
      taxable: 0,
      tax: 0,
      total: 0,
    })
  })
})

describe('formatCurrency', () => {
  it('formats USD', () => {
    expect(formatCurrency(1234.5, 'USD', 'en-US')).toBe('$1,234.50')
  })
  it('formats EUR with a German locale', () => {
    // Non-breaking spaces are used by Intl; normalise before comparing.
    const out = formatCurrency(1234.5, 'EUR', 'de-DE').replace(/ /g, ' ')
    expect(out).toBe('1.234,50 €')
  })
  it('falls back gracefully for an invalid currency code', () => {
    expect(formatCurrency(10, 'NOTACODE')).toBe('NOTACODE 10.00')
  })
})
