// import { Component } from '@angular/core';
// import { NgIf, NgFor } from '@angular/common';
// import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// import { ApiService } from '../core/services/api.service';

// @Component({
//   selector: 'app-layout',
//   standalone: true,
//   imports: [NgIf, NgFor, RouterLink, RouterLinkActive, RouterOutlet],
//   templateUrl: './layout.component.html',
//   styleUrl: './layout.component.scss'
// })
// export class LayoutComponent {
//   notificationCount = 0;
//   currentUser: { username: string; role: string } | null = null;

//   isResizing = false;

//   constructor(private api: ApiService, private router: Router) {

//     // Notifications
//     this.api.getNotifications().subscribe(list => {
//       this.notificationCount = list.filter(n => !n.read).length;
//     });

//     // Restore sidebar width
//     const saved = localStorage.getItem('sidebarWidth');
//     if (saved) {
//       setTimeout(() => {
//         const el = document.querySelector('.sidebar') as HTMLElement;
//         if (el) el.style.width = saved + 'px';
//       });
//     }

//     // User
//     const stored = localStorage.getItem('user');
//     if (stored) {
//       try {
//         this.currentUser = JSON.parse(stored);
//       } catch {
//         this.currentUser = null;
//       }
//     }
//   }

//   startResize(event: MouseEvent) {
//     this.isResizing = true;

//     const sidebar = (event.target as HTMLElement).parentElement as HTMLElement;
//     const container = sidebar.parentElement as HTMLElement;

//     const onMouseMove = (e: MouseEvent) => {
//       if (!this.isResizing) return;

//       const rect = container.getBoundingClientRect();

//       let newWidth = e.clientX - rect.left;

//       const minWidth = 180;
//       const maxWidth = rect.width - 100;

//       if (newWidth < minWidth) newWidth = minWidth;
//       if (newWidth > maxWidth) newWidth = maxWidth;

//       sidebar.style.width = newWidth + 'px';

//       // Save
//       localStorage.setItem('sidebarWidth', newWidth.toString());
//     };

//     const stopResize = () => {
//       this.isResizing = false;
//       document.removeEventListener('mousemove', onMouseMove);
//       document.removeEventListener('mouseup', stopResize);
//     };

//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', stopResize);
//   }

//   onLogout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     this.router.navigate(['/login']);
//   }

//   navItems = [
//     { path: '/dashboard', label: 'Dashboard', icon: '📈' },
//     { path: '/purchase-orders', label: 'Purchase Orders', icon: '🧾' },
//     { path: '/intake/invoices', label: 'Product Intake', icon: '📥' },
//     { path: '/stock-allocation', label: 'Stock & Bin Assignment', icon: '📋' },
//     { path: '/store-allocation', label: 'Store Allocation', icon: '🏪' },
//     { path: '/picker', label: 'Picker', icon: '📦' },
//     { path: '/dispatch', label: 'Dispatch', icon: '🚚' },
//     { path: '/tracking', label: 'Tracking & Deviations', icon: '📍' },
//     { path: '/notifications', label: 'Notifications', icon: '🔔' },
//     { path: '/outlet-receiving', label: 'Store Receiving', icon: '✅' },
//     { path: '/reports', label: 'Reports', icon: '📊' },
//     { path: '/masters', label: 'Masters', icon: '⚙️' },
//   ];
// }




import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  notificationCount = 0;
  currentUser: { username: string; role: string } | null = null;

  isResizing = false;
  mastersOpen = false;

  constructor(private api: ApiService, private router: Router) {

    // Masters open state
    this.mastersOpen = this.router.url.startsWith('/masters');

    // Notifications
    this.api.getNotifications().subscribe(list => {
      this.notificationCount = list.filter(n => !n.read).length;
    });

    // Restore sidebar width
    const saved = localStorage.getItem('sidebarWidth');
    if (saved) {
      setTimeout(() => {
        const el = document.querySelector('.sidebar') as HTMLElement;
        if (el) el.style.width = saved + 'px';
      });
    }

    // User
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch {
        this.currentUser = null;
      }
    }
  }

  startResize(event: MouseEvent) {
    this.isResizing = true;

    const sidebar = (event.target as HTMLElement).parentElement as HTMLElement;
    const container = sidebar.parentElement as HTMLElement;

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isResizing) return;

      const rect = container.getBoundingClientRect();

      let newWidth = e.clientX - rect.left;

      const minWidth = 180;
      const maxWidth = rect.width - 100;

      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      sidebar.style.width = newWidth + 'px';

      // Save
      localStorage.setItem('sidebarWidth', newWidth.toString());
    };

    const stopResize = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResize);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResize);
  }

  toggleMasters(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.mastersOpen = !this.mastersOpen;
    if (this.mastersOpen) {
      this.router.navigate(['/masters']);
    }
  }

  isMastersActive(): boolean {
    return this.router.url.startsWith('/masters');
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  masterNavItems = [
    { path: '/masters/users', label: 'Users (RBAC)' },
    { path: '/masters/drivers', label: 'Drivers' },
    { path: '/masters/pickers', label: 'Pickers' },
    { path: '/masters/stores', label: 'Stores' },
    { path: '/masters/dispatch-managers', label: 'Dispatch Managers' },
    { path: '/masters/roles-lists', label: 'Roles & Permission' },
  ];

  navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/purchase-orders', label: 'Purchase Orders' },
    { path: '/intake/invoices', label: 'Product Intake' },
    { path: '/stock-allocation', label: 'Stock & Bin Assignment' },
    { path: '/store-allocation', label: 'Store Allocation' },
    { path: '/picker', label: 'Picker' },
    { path: '/dispatch', label: 'Dispatch' },
    { path: '/tracking', label: 'Tracking & Deviations' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/outlet-receiving', label: 'Store Receiving' },
    { path: '/reports', label: 'Reports' },
    { path: '/masters', label: 'Masters' },
  ];
}