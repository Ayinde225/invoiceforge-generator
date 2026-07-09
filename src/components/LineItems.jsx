import { lineTotal, formatCurrency } from '../lib/money.js'

export default function LineItems({ items, currency, locale, onChange, onAdd, onRemove }) {
  return (
    <div className="line-items">
      <div className="line-items-head">
        <span className="col-desc">Description</span>
        <span className="col-qty">Qty</span>
        <span className="col-price">Unit price</span>
        <span className="col-total">Total</span>
        <span className="col-actions" aria-hidden="true"></span>
      </div>

      {items.map((item) => (
        <div className="line-item-row" key={item.id}>
          <input
            className="col-desc"
            type="text"
            placeholder="Item or service"
            value={item.description}
            onChange={(e) => onChange(item.id, { description: e.target.value })}
          />
          <input
            className="col-qty"
            type="number"
            min="0"
            step="any"
            value={item.quantity}
            onChange={(e) => onChange(item.id, { quantity: e.target.value })}
          />
          <input
            className="col-price"
            type="number"
            min="0"
            step="any"
            value={item.unitPrice}
            onChange={(e) => onChange(item.id, { unitPrice: e.target.value })}
          />
          <span className="col-total line-total">
            {formatCurrency(lineTotal(item), currency, locale)}
          </span>
          <button
            type="button"
            className="col-actions icon-btn"
            aria-label="Remove line item"
            onClick={() => onRemove(item.id)}
            disabled={items.length === 1}
          >
            ✕
          </button>
        </div>
      ))}

      <button type="button" className="btn btn-ghost add-row" onClick={onAdd}>
        + Add line item
      </button>
    </div>
  )
}
