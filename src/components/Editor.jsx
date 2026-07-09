import { Field, TextInput } from './Field.jsx'
import LineItems from './LineItems.jsx'
import { CURRENCIES } from '../lib/defaults.js'

export default function Editor({ invoice, locale, update, updateNested, itemHandlers }) {
  return (
    <div className="editor">
      <section className="card">
        <h2 className="card-title">Invoice details</h2>
        <div className="grid grid-2">
          <Field label="Invoice number">
            <TextInput value={invoice.number} onChange={(v) => update({ number: v })} />
          </Field>
          <Field label="Currency">
            <select
              value={invoice.currency}
              onChange={(e) => update({ currency: e.target.value })}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Issue date">
            <input
              type="date"
              value={invoice.issueDate}
              onChange={(e) => update({ issueDate: e.target.value })}
            />
          </Field>
          <Field label="Due date">
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => update({ dueDate: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <div className="grid grid-2 stretch">
        <section className="card">
          <h2 className="card-title">From (your business)</h2>
          <Field label="Name">
            <TextInput
              value={invoice.sender.name}
              onChange={(v) => updateNested('sender', { name: v })}
            />
          </Field>
          <Field label="Email">
            <TextInput
              value={invoice.sender.email}
              onChange={(v) => updateNested('sender', { email: v })}
            />
          </Field>
          <Field label="Address">
            <textarea
              rows="2"
              value={invoice.sender.address}
              onChange={(e) => updateNested('sender', { address: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <TextInput
              value={invoice.sender.phone}
              onChange={(v) => updateNested('sender', { phone: v })}
            />
          </Field>
        </section>

        <section className="card">
          <h2 className="card-title">Bill to (client)</h2>
          <Field label="Name">
            <TextInput
              value={invoice.client.name}
              onChange={(v) => updateNested('client', { name: v })}
            />
          </Field>
          <Field label="Email">
            <TextInput
              value={invoice.client.email}
              onChange={(v) => updateNested('client', { email: v })}
            />
          </Field>
          <Field label="Address">
            <textarea
              rows="2"
              value={invoice.client.address}
              onChange={(e) => updateNested('client', { address: e.target.value })}
            />
          </Field>
        </section>
      </div>

      <section className="card">
        <h2 className="card-title">Line items</h2>
        <LineItems
          items={invoice.items}
          currency={invoice.currency}
          locale={locale}
          onChange={itemHandlers.change}
          onAdd={itemHandlers.add}
          onRemove={itemHandlers.remove}
        />
      </section>

      <section className="card">
        <h2 className="card-title">Discount &amp; tax</h2>
        <div className="grid grid-3">
          <Field label="Discount type">
            <select
              value={invoice.discount.type}
              onChange={(e) => updateNested('discount', { type: e.target.value })}
            >
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat amount</option>
            </select>
          </Field>
          <Field label="Discount value">
            <input
              type="number"
              min="0"
              step="any"
              value={invoice.discount.value}
              onChange={(e) => updateNested('discount', { value: e.target.value })}
            />
          </Field>
          <Field label="Tax / VAT (%)">
            <input
              type="number"
              min="0"
              step="any"
              value={invoice.taxRate}
              onChange={(e) => update({ taxRate: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Notes &amp; payment terms</h2>
        <textarea
          rows="3"
          value={invoice.notes}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </section>
    </div>
  )
}
