# Data and API Breakdown

## Data Layer

- **API facade:** `src/app/core/api.service.ts`
- **Base path:** `/api` (proxied to json-server in local setup)
- **Fallback behavior:** On read failures, service loads `/db.json` and resolves lists in-memory for read-only continuity.

## Entity Contracts

Defined in `src/app/models/index.ts`:

- `Invoice`
- `Product`
- `Outlet`
- `User`
- `Driver`
- `Picker`
- `DispatchManager`
- `Parcel`
- `Deviation`
- `Notification`
- `Transfer`

## API Collections and Methods

- Invoices: `getInvoices`, `addInvoice`
- Products: `getProducts`, `getProduct`, `addProduct`, `updateProduct`, `bulkAddProducts`
- Outlets: `getOutlets`, `getOutlet`, `addOutlet`, `updateOutlet`
- Parcels: `getParcels`, `getParcel`, `addParcel`, `updateParcel`
- Drivers: `getDrivers`, `getDriver`, `addDriver`, `updateDriver`
- Users: `getUsers`, `getUser`, `addUser`, `updateUser`
- Pickers: `getPickers`, `getPicker`, `addPicker`, `updatePicker`
- Dispatch Managers: `getDispatchManagers`, `getDispatchManager`, `addDispatchManager`, `updateDispatchManager`
- Deviations: `getDeviations`, `markDeviationRead`
- Notifications: `getNotifications`, `markNotificationRead`
- Transfers: `getTransfers`, `addTransfer`, `updateTransfer`

## Verification Snapshot

- Build command executed: `npm run build`
- Result: success
- Non-blocking warnings observed:
  - Redundant `??` usage in templates where value is already non-nullable
  - Redundant `?.` usage in templates where value is non-nullable

