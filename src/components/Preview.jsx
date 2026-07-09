import { computeTotals, lineTotal, formatCurrency } from '../lib/money.js'

function fmtDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Preview({ invoice, locale }) {
  const { currency } = invoice
  const totals = computeTotals(invoice)
  const money = (v) => formatCurrency(v, currency, locale)
  const discountLabel =
    invoice.discount.type === 'percent'
      ? `Discount (${invoice.discount.value || 0}%)`
      : 'Discount'

  return (
    <div className="invoice-sheet" id="invoice-print">
      <header className="inv-header">
        <div className="inv-brand">
          <div className="inv-logo">{(invoice.sender.name || 'I').charAt(0)}</div>
          <div>
            <h1 className="inv-sender-name">{invoice.sender.name || 'Your Business Name'}</h1>
            {invoice.sender.email && <p>{invoice.sender.email}</p>}
            {invoice.sender.phone && <p>{invoice.sender.phone}</p>}
            {invoice.sender.address && (
              <p className="inv-multiline">{invoice.sender.address}</p>
            )}
          </div>
        </div>
        <div className="inv-title-block">
          <h2 className="inv-title">INVOICE</h2>
          <p className="inv-number">{invoice.number}</p>
        </div>
      </header>

      <section className="inv-meta">
        <div>
          <span className="inv-meta-label">Bill to</span>
          <p className="inv-client-name">{invoice.client.name || '—'}</p>
          {invoice.client.email && <p>{invoice.client.email}</p>}
          {invoice.client.address && (
            <p className="inv-multiline">{invoice.client.address}</p>
          )}
        </div>
        <div className="inv-dates">
          <div>
            <span className="inv-meta-label">Issue date</span>
            <p>{fmtDate(invoice.issueDate)}</p>
          </div>
          <div>
            <span className="inv-meta-label">Due date</span>
            <p>{fmtDate(invoice.dueDate)}</p>
          </div>
        </div>
      </section>

      <table className="inv-table">
        <thead>
          <tr>
            <th className="ta-left">Description</th>
            <th className="ta-right">Qty</th>
            <th className="ta-right">Unit price</th>
            <th className="ta-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td className="ta-left">{item.description || '—'}</td>
              <td className="ta-right">{item.quantity || 0}</td>
              <td className="ta-right">{money(item.unitPrice)}</td>
              <td className="ta-right">{money(lineTotal(item))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="inv-totals-wrap">
        <div className="inv-totals">
          <div className="inv-total-row">
            <span>Subtotal</span>
            <span>{money(totals.subtotal)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="inv-total-row">
              <span>{discountLabel}</span>
              <span>−{money(totals.discount)}</span>
            </div>
          )}
          {totals.tax > 0 && (
            <div className="inv-total-row">
              <span>Tax / VAT ({invoice.taxRate || 0}%)</span>
              <span>{money(totals.tax)}</span>
            </div>
          )}
          <div className="inv-total-row inv-grand">
            <span>Total due</span>
            <span>{money(totals.total)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <footer className="inv-notes">
          <span className="inv-meta-label">Notes</span>
          <p className="inv-multiline">{invoice.notes}</p>
        </footer>
      )}
    </div>
  )
}
