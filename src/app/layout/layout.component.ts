import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../core/api.service';

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

  constructor(private api: ApiService, private router: Router) {

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

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📈' },
    { path: '/purchase-orders', label: 'Purchase Orders', icon: '🧾' },
    { path: '/intake/invoices', label: 'Product Intake', icon: '📥' },
    { path: '/stock-allocation', label: 'Stock & Bin Assignment', icon: '📋' },
    { path: '/store-allocation', label: 'Store Allocation', icon: '🏪' },
    { path: '/picker', label: 'Picker', icon: '📦' },
    { path: '/dispatch', label: 'Dispatch', icon: '🚚' },
    { path: '/tracking', label: 'Tracking & Deviations', icon: '📍' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/outlet-receiving', label: 'Store Receiving', icon: '✅' },
    { path: '/reports', label: 'Reports', icon: '📊' },
    { path: '/masters', label: 'Masters', icon: '⚙️' },
  ];
}