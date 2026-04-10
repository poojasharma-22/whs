export interface Invoice {
  id: number;
  qty?: number,   
  invoiceNumber: string;
  fileName: string;
  uploadedAt: string;
  status: string;
}

export interface Product {
  id: number;
  invoiceId: number;
  brand: string;
  productName: string;
  model: string;
  imei: string;
  colour: string;
  ram: string;
  storage: string;
  qty: number;
  hsnCode: string;
  sku: string;
  binNumber: number | null;
  outletId: number | null;
  status: 'in_stock' | 'assigned' | 'picked' | 'dispatched' | 'received';
  barcode: string;
}

export interface Outlet {
  id: number;
  name: string;
  code: string;
  address: string;
}

export type UserRole = 'admin' | 'manager' | 'picker' | 'driver' | 'store_staff' | 'dispatch_manager';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface Driver {
  id: number;
  username?: string;
  name: string;
  email?: string;
  phone: string;
  vehicleNumber: string;
}

export interface Picker {
  id: number;
  username?: string;
  name: string;
  email?: string;
  phone: string;
  code: string;
}

export interface DispatchManager {
  id: number;
  username?: string;
  name: string;
  email?: string;
  phone: string;
  code: string;
}

export interface Parcel {
  id: number;
  outletId: number;
  productIds: number[];
  driverId: number | null;
  status: 'pending' | 'ready_for_dispatch' | 'dispatched' | 'in_transit' | 'delivered';
  ewayBillNumber: string | null;
  createdAt: string;
  dispatchedAt: string | null;
}

export interface Deviation {
  id: number;
  driverId: number;
  driverName: string;
  parcelId: number;
  timestamp: string;
  description: string;
  read: boolean;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Transfer {
  id: number;
  outletId: number;
  outletName: string;
  driverId: number;
  driverName: string;
  parcelCount: number;
  productCount: number;
  dispatchDate: string;
  status: string;
}


export interface PurchaseOrder {
  id: number;
  poNumber: string;       
  vendorName: string;     
  fileName: string;       
  uploadedAt: string;
  status: 'pending' | 'in_progress' | 'completed';
  invoiceCount: number;   // kitne invoices linked hain (computed/cached)
}


export interface POInvoice {
  id: number;
  poId: number;           // yeh PurchaseOrder.id se link karta hai
  invoiceNumber: string;  // e.g. "INV-ABC-00123"
  fileName: string;       // invoice PDF
  uploadedAt: string;
  status: 'pending' | 'in_progress' | 'completed';
}