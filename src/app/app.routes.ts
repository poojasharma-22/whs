import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      
      { path: 'intake/invoices', loadComponent: () => import('./features/intake/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent) },
      { path: 'intake/invoices/:id/products', loadComponent: () => import('./features/intake/product-list/product-list.component').then(m => m.ProductListComponent) },
     
     
     // -- new product order add karenge
     // -- po lists
      {path:'purchase-orders', loadComponent: () => import('./features/purchase-orders/po-list/po-list.component').then(m=>m.PoListComponent)},
     
     // -- invoices under po
      { path: 'purchase-orders/:poId/invoices', loadComponent: () => import('./features/purchase-orders/po-invoice-list/po-invoice-list.component').then(m => m.PoInvoiceListComponent) },
     
     // Screen 3: Products under a PO's invoice ( existing product-list me resuse karnege)
      { path: 'purchase-orders/:poId/invoices/:id/products', loadComponent: () => import('./features/intake/product-list/product-list.component').then(m => m.ProductListComponent) },
     
     
     
    
      { path: 'stock-allocation', loadComponent: () => import('./features/stock-allocation/stock-allocation.component').then(m => m.StockAllocationComponent) },
      { path: 'store-allocation', loadComponent: () => import('./features/store-allocation/store-allocation.component').then(m => m.StoreAllocationComponent) },
      { path: 'picker', loadComponent: () => import('./features/picker/picker-list/picker-list.component').then(m => m.PickerListComponent) },
      { path: 'dispatch', loadComponent: () => import('./features/dispatch/dispatch-list/dispatch-list.component').then(m => m.DispatchListComponent) },
      { path: 'tracking', loadComponent: () => import('./features/tracking/tracking-list/tracking-list.component').then(m => m.TrackingListComponent) },
      { path: 'deviations', redirectTo: 'tracking', pathMatch: 'full' },
      { path: 'notifications', loadComponent: () => import('./features/notifications/notifications-list/notifications-list.component').then(m => m.NotificationsListComponent) },
      { path: 'outlet-receiving', loadComponent: () => import('./features/outlet-receiving/outlet-receiving-list/outlet-receiving-list.component').then(m => m.OutletReceivingListComponent) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports-view/reports-view.component').then(m => m.ReportsViewComponent) },
      {
        path: 'masters',
        loadComponent: () => import('./features/masters/masters-shell/masters-shell.component').then(m => m.MastersShellComponent),
        children: [
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          { path: 'users', loadComponent: () => import('./features/masters/user-list/user-list.component').then(m => m.UserListComponent) },
          { path: 'drivers', loadComponent: () => import('./features/masters/driver-list/driver-list.component').then(m => m.DriverListComponent) },
          { path: 'pickers', loadComponent: () => import('./features/masters/picker-list/picker-list-master.component').then(m => m.PickerListMasterComponent) },
          { path: 'stores', loadComponent: () => import('./features/masters/store-list/store-list.component').then(m => m.StoreListComponent) },
          { path: 'dispatch-managers', loadComponent: () => import('./features/masters/dispatch-manager-list/dispatch-manager-list.component').then(m => m.DispatchManagerListComponent) },
          {path:'roles-lists', loadComponent: () => import('./features/masters/roles-lists/roles-list.component').then(m => m.RolesListComponent)},
        ]
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
