# InvoiceForge — Invoice Generator

> A polished, client-side invoice builder: fill in your details, watch a professional invoice render live, and export it to PDF — all in the browser, no backend, no sign-up.

🔗 **Live demo:** https://ayinde225.github.io/invoiceforge-generator/

[![Deploy](https://github.com/Ayinde225/invoiceforge-generator/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ayinde225/invoiceforge-generator/actions/workflows/deploy.yml)

---

## Features

- **Full invoice editor** — sender (your business) and client details, invoice number, issue/due dates, and a currency selector.
- **Line items table** — add/remove rows with description, quantity and unit price; per-line totals update automatically.
- **Live money math** — subtotal, flat *or* percentage discount, configurable tax/VAT, and grand total, all recomputed instantly.
- **Notes & payment terms** field for the fine print.
- **Professional live preview** — a real-looking invoice with clean typography, aligned columns and a totals block.
- **Export to PDF** — a dedicated `@media print` stylesheet means "Download / Print PDF" opens the browser print dialog showing *only* the invoice, formatted for A4. No heavy PDF library.
- **Save to localStorage** — store invoices and reload, duplicate or delete them from the saved list.
- **Currency formatting** via `Intl.NumberFormat` (USD, EUR, GBP, NGN, CAD, AUD, JPY, INR).
- **Responsive, modern, business-like UI.**

## Tech stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) (JavaScript)
- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react)
- [Vitest](https://vitest.dev/) for unit tests
- Pure calculation helpers in `src/lib/` — no runtime dependencies beyond React
- Deployed to GitHub Pages via GitHub Actions

## Getting started

```bash
# clone
git clone https://github.com/Ayinde225/invoiceforge-generator.git
cd invoiceforge-generator

# install
npm install

# run the dev server
npm run dev

# production build
npm run build
```

## Testing

The money math (line totals, subtotal, percentage vs flat discount, tax, grand total, 2-decimal rounding and currency formatting) is covered by Vitest unit tests.

```bash
npm test
```

## Project structure

```
src/
  lib/
    money.js         # pure calculation + currency-format helpers
    money.test.js    # Vitest unit tests
    storage.js       # localStorage persistence
    defaults.js      # currencies + blank invoice factory
  components/
    Editor.jsx       # the invoice form
    LineItems.jsx    # editable line-items table
    Preview.jsx      # professional live invoice preview
    SavedList.jsx    # saved-invoices list (load/duplicate/delete)
    Field.jsx        # small form primitives
  App.jsx            # state + wiring
  main.jsx           # entry point
  index.css          # UI + print stylesheet
```

## Author

**Ayinde Abdul Aziz** — [@Ayinde225](https://github.com/Ayinde225)
