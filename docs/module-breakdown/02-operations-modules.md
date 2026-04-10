# Operations Modules Breakdown

## Dashboard

- **Route:** `/dashboard`
- **Component:** `src/app/features/dashboard/dashboard.component.ts`
- **Purpose:** Landing page module for high-level portal entry.
- **Primary data usage:** No direct API call inside component logic.

## Intake

- **Routes:** `/intake/invoices`, `/intake/invoices/:id/products`
- **Components:**
  - `src/app/features/intake/invoice-list/invoice-list.component.ts`
  - `src/app/features/intake/product-list/product-list.component.ts`
  - `src/app/features/intake/add-item-form/add-item-form.component.ts`
  - `src/app/features/intake/assign-bin-modal/assign-bin-modal.component.ts`
- **Purpose:** Create invoices, add products (single and bulk), and assign inventory metadata.
- **API touchpoints (via `ApiService`):**
  - `getInvoices`, `addInvoice`
  - `getProducts`, `addProduct`, `updateProduct`

## Stock Allocation

- **Route:** `/stock-allocation`
- **Component:** `src/app/features/stock-allocation/stock-allocation.component.ts`
- **Purpose:** Allocate bin details and inventory quantities.
- **API touchpoints:** `getInvoices`, `getProducts`, `updateProduct`

## Store Allocation

- **Route:** `/store-allocation`
- **Component:** `src/app/features/store-allocation/store-allocation.component.ts`
- **Purpose:** Assign products from stock to destination outlets/stores.
- **API touchpoints:** `getOutlets`, `getProducts`, `updateProduct`

## Picker

- **Route:** `/picker`
- **Component:** `src/app/features/picker/picker-list/picker-list.component.ts`
- **Purpose:** Manage picking stage and simulate product pickup workflow.
- **API touchpoints:** `getProducts`, `getOutlets`, `updateProduct`

## Dispatch

- **Route:** `/dispatch`
- **Component:** `src/app/features/dispatch/dispatch-list/dispatch-list.component.ts`
- **Purpose:** Create parcel from picked products, assign driver, and move dispatch state.
- **API touchpoints:**
  - Read: `getDrivers`, `getOutlets`, `getProducts`, `getParcels`
  - Write: `addParcel`, `updateParcel`, `updateProduct`

## Tracking

- **Route:** `/tracking`
- **Components:**
  - `src/app/features/tracking/tracking-list/tracking-list.component.ts`
  - `src/app/features/tracking/track-driver-modal/track-driver-modal.component.ts`
- **Purpose:** Monitor parcel/driver movement and handle deviation status.
- **API touchpoints:** `getDeviations`, `getParcels`, `getOutlets`, `getDrivers`, `markDeviationRead`

## Deviations

- **Route behavior:** `/deviations` redirects to `/tracking`
- **Component file present:** `src/app/features/deviations/deviations-list/deviations-list.component.ts`
- **Purpose:** Dedicated deviation listing behavior is implemented at component level, while route currently consolidates into tracking.
- **API touchpoints:** `getDeviations`, `markDeviationRead`

## Notifications

- **Route:** `/notifications`
- **Component:** `src/app/features/notifications/notifications-list/notifications-list.component.ts`
- **Purpose:** Notification inbox and read/unread lifecycle.
- **API touchpoints:** `getNotifications`, `markNotificationRead`

## Outlet Receiving

- **Route:** `/outlet-receiving`
- **Component:** `src/app/features/outlet-receiving/outlet-receiving-list/outlet-receiving-list.component.ts`
- **Purpose:** Track products that reached outlet and mark receiving status.
- **API touchpoints:** `getProducts`, `updateProduct`

## Reports

- **Route:** `/reports`
- **Component:** `src/app/features/reports/reports-view/reports-view.component.ts`
- **Purpose:** Generate transfer and dispatch-focused reporting views.
- **API touchpoints:** `getProducts`, `getOutlets`, `getParcels`

