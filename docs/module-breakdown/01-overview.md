# Admin Portal Module Breakdown - Verified Overview

## Verification Status

- Project type: Angular standalone app (`admin-portal`)
- Primary route configuration: `src/app/app.routes.ts`
- API service: `src/app/core/api.service.ts`
- Data contracts: `src/app/models/index.ts`
- Build verification: `npm run build` completed successfully
- Build notes: Angular compiler raised template quality warnings (optional chaining and nullish coalescing usage), but no build-breaking errors

## Module Inventory (Route Based)

- Dashboard (`/dashboard`)
- Intake (`/intake/invoices`, `/intake/invoices/:id/products`)
- Stock Allocation (`/stock-allocation`)
- Store Allocation (`/store-allocation`)
- Picker (`/picker`)
- Dispatch (`/dispatch`)
- Tracking (`/tracking`)
- Deviations (redirects to tracking)
- Notifications (`/notifications`)
- Outlet Receiving (`/outlet-receiving`)
- Reports (`/reports`)
- Masters (`/masters/*`)

## Documentation Files

- `docs/module-breakdown/02-operations-modules.md`
- `docs/module-breakdown/03-admin-masters-modules.md`
- `docs/module-breakdown/04-data-and-api.md`

