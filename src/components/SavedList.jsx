import { computeTotals, formatCurrency } from '../lib/money.js'
import { localeFor } from '../lib/defaults.js'

export default function SavedList({ saved, currentId, onLoad, onDuplicate, onDelete }) {
  if (saved.length === 0) {
    return <p className="saved-empty">No saved invoices yet. Click “Save” to store one here.</p>
  }

  return (
    <ul className="saved-list">
      {saved.map((inv) => {
        const total = computeTotals(inv).total
        return (
          <li
            key={inv.id}
            className={`saved-item ${inv.id === currentId ? 'is-current' : ''}`}
          >
            <button type="button" className="saved-main" onClick={() => onLoad(inv.id)}>
              <span className="saved-number">{inv.number || 'Untitled'}</span>
              <span className="saved-sub">
                {inv.client.name || 'No client'} ·{' '}
                {formatCurrency(total, inv.currency, localeFor(inv.currency))}
              </span>
            </button>
            <div className="saved-actions">
              <button
                type="button"
                className="icon-btn"
                title="Duplicate"
                aria-label="Duplicate invoice"
                onClick={() => onDuplicate(inv.id)}
              >
                ⧉
              </button>
              <button
                type="button"
                className="icon-btn"
                title="Delete"
                aria-label="Delete invoice"
                onClick={() => onDelete(inv.id)}
              >
                🗑
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
