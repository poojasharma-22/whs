# Sangeetha WHM – Admin Portal

Angular admin portal for **Warehouse Asset Intake & Dispatch**: product intake, picker, dispatch, tracking, driver deviation, notifications, outlet receiving, and reports. Data is persisted in a local JSON database for demo and reuse.

## Prerequisites

- Node.js 18+
- npm

## Setup & run (demo)

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the local database** (persists data in `db.json`):
   ```bash
   npm run db
   ```
   This runs json-server on **http://localhost:3000**. Keep this terminal open.

3. **Start the Angular app** (in a second terminal):
   ```bash
   npm start
   ```
   Open **http://localhost:4200** in the browser.

## Demo flow (for students)

1. **Product Intake**
   - Upload an invoice (PDF) – appears in the list.
   - Click **Upload products** for an invoice.
   - **Add items** (form: Brand, Product name, Model, IMEI, Colour, RAM, Storage, HSN Code, SKU, Barcode).
   - Use **Download sample file** and **Bulk upload** (CSV) to add multiple items.
   - Select items with checkboxes → **Assign to Bin & outlet** → choose Bin (1–100) → choose Outlet.

2. **Picker**
   - View assigned products. Use **Simulate pick** to mark the first assigned item as “Picked up” (simulates barcode scan from mobile app).

3. **Dispatch**
   - Click **Create parcel from picked items (demo)** to create a parcel.
   - For “Ready for Dispatch” parcels, click **Assign driver** and select a driver. eWay bill is stored with the parcel.

4. **Tracking**
   - View list (outlet, driver, parcels, products, dispatch date). Click **Track driver** to open the map (demo: static OpenStreetMap).

5. **Driver deviation**
   - List shows deviations (driver name, date/time). Mark as read.

6. **Notifications**
   - Deviations and alerts appear here. Mark as read.

7. **Outlet receiving**
   - View dispatched/received items. Use **Mark first dispatched item as received** to simulate outlet scan.

8. **Reports**
   - **Number of Transfers**, **Generic Transfer** (list), **Store wise Transfer**.
   - Use filters: date range, outlet, then **Run report**.

## Project structure

- `src/app/features/` – Intake, Picker, Dispatch, Tracking, Deviations, Notifications, Outlet receiving, Reports.
- `src/app/core/api.service.ts` – HTTP client for local API.
- `src/app/models/` – TypeScript interfaces.
- `db.json` – Local database (in project root); edited by json-server when you add/update data.

## API (json-server)

- Base URL: `http://localhost:3000`
- Endpoints: `/invoices`, `/products`, `/outlets`, `/parcels`, `/drivers`, `/deviations`, `/notifications`, `/transfers`
- Data is saved to `db.json` so it persists between runs for demos.

## Build

```bash
npm run build
```

Output: `dist/admin-portal/`.
