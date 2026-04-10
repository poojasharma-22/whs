// import { Component } from '@angular/core';
// import { NgFor } from '@angular/common';
// import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-masters-shell',
//   standalone: true,
//   imports: [NgFor, RouterLink, RouterLinkActive, RouterOutlet],
//   templateUrl: './masters-shell.component.html',
//   styleUrl: './masters-shell.component.scss'
// })
// export class MastersShellComponent {
//   masterNavItems = [
//     { path: '/masters/users', label: 'Users (RBAC)', icon: '👤' },
//     { path: '/masters/drivers', label: 'Drivers', icon: '🚛' },
//     { path: '/masters/pickers', label: 'Pickers', icon: '📋' },
//     { path: '/masters/stores', label: 'Stores', icon: '🏪' },
//     { path: '/masters/dispatch-managers', label: 'Dispatch Managers', icon: '📌' },
//     {path: '/masters/roles-lists', label:'Roles & Permission', icon: '🔑' }
//   ];
// }


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-masters-shell',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './masters-shell.component.html',
  styleUrl: './masters-shell.component.scss'
})
export class MastersShellComponent {}