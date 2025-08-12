# Invoice Explorer UI

Small React (Vite) project scaffold for the Invoice Explorer UI.

## Run locally

1. Install dependencies:
   ```
   npm install
   ```
2. Run dev server:
   ```
   npm run dev
   ```

This project contains modular components:
- `components/InvoiceTable.jsx` - Displays uploaded and failed invoices with alternate row highlighting and actions.
- `components/InvoiceActionsDropdown.jsx` - Dropdown for invoice actions (view, download, etc).
- `components/InvoiceEditableFields.jsx` - Inline editing for failed invoice fields.
- `pages/InvoiceExplorer.jsx` - Main page with upload, bulk upload, tables, and pagination.
- `styles/global.css` and `styles/colors.js` - Modern, responsive, and visually enhanced styles.

## Features

- **Pagination**: Both uploaded and failed invoice tables support pagination. Page size is configurable in `config.js`.
- **API Integration**: Expects backend endpoints for `/api/invoices`, `/api/failed-invoices`, `/api/upload`, `/api/bulk-upload`, and `/api/move-failed-invoice`.
   - Pagination params: `page` and `pageSize`.
   - API responses should include a `totalCount` field for pagination.
- **Modern UI/UX**:
   - Blue gradient header with logo and navigation.
   - Responsive, elevated tables with alternate row highlighting.
   - Attractive container with colored borders, shadow, and gradient background.
   - Animated logo with glow effect.
   - Toast notifications for actions.
   - Copyright footer.
- **Customization**:
   - Easily adjust colors and layout in `global.css` and `InvoiceExplorer.jsx`.
   - Logo and branding can be swapped in `/public/` and header.

## API Response Example

```
{
   "data": [ /* array of invoices */ ],
   "totalCount": 123
}
```

## Screenshots

> Add screenshots here to showcase the UI and features.

---
© MerakiAi. All rights reserved.