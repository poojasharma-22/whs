// import { Component } from '@angular/core';
// import { NgFor, NgIf } from '@angular/common';
// import {FormsModule} from '@angular/forms'

// interface RoleEntry {
//   icon: string;
//   name: string;
//   permissions: string; // still string for display
// }

// @Component({
//   selector: 'app-roles-list',
//   standalone: true,
//   imports: [NgFor, NgIf, FormsModule],
//   templateUrl: './roles-list.component.html',
//   styleUrl: './roles-list.component.scss'
// })
// export class RolesListComponent {
//   // ✅ NEW: master permission list
//   allPermissions: string[] = [
//     'Dashboard',
//     'Purchase Orders',
//     'Product Intake',
//     'Stock & Bin Assignment',
//     'Store Allocation',
//     'Picker',
//     'Dispatch',
//     'Tracking',
//     'Store Receiving',
//     'Reports',
//     'Masters',
//     'Notifications'
//   ];

//   roles: RoleEntry[] = [
//     {
//       icon: '👑',
//       name: 'Super Admin',
//       permissions: 'Dashboard, Purchase Orders, Reports'
//     }
//   ];

//   showModal = false;
//   editingIndex: number | null = null;
//   showPermissionDropdown = false;

//   // UPDATED FORM KER Diye
//   form = {
//     icon: '',
//     name: '',
//     selectedPermissions: [] as string[],
//     customPermissions: ''
//   };

//   //  ADD MODE KIYA
//   openAdd() {
//     this.form = {
//       icon: '',
//       name: '',
//       selectedPermissions: [],
//       customPermissions: ''
//     };
//     this.editingIndex = null;
//     this.showPermissionDropdown = false;
//     this.showModal = true;
    
//   }

//   //  EDIT MODE (important logic)
//   openEdit(index: number) {
//     const role = this.roles[index];

//     const permsArray = role.permissions.split(',').map(p => p.trim());

//     this.form = {
//       icon: role.icon,
//       name: role.name,
//       selectedPermissions: permsArray.filter(p =>
//         this.allPermissions.includes(p)
//       ),
//       customPermissions: permsArray
//         .filter(p => !this.allPermissions.includes(p))
//         .join(', ')
//     };

//     this.editingIndex = index;
//     this.showPermissionDropdown = false; 
//     this.showModal = true;
//   }

//   //  CHECKBOX HANDLER
//   onPermissionToggle(event: any) {
//     const value = event.target.value;

//     if (event.target.checked) {
//       this.form.selectedPermissions.push(value);
//     } else {
//       this.form.selectedPermissions =
//         this.form.selectedPermissions.filter(p => p !== value);
//     }
//   }

//   //  SAVE LOGIC (MERGE BOTH)
//   save() {
//     if (!this.form.name?.trim()) return;

//     const custom = this.form.customPermissions
//       ? this.form.customPermissions.split(',').map(p => p.trim())
//       : [];

//     const finalPermissions = [
//       ...this.form.selectedPermissions,
//       ...custom
//     ];

//     const role: RoleEntry = {
//       icon: this.form.icon,
//       name: this.form.name,
//       permissions: finalPermissions.join(', ')
//     };

//     if (this.editingIndex !== null) {
//       this.roles[this.editingIndex] = role;
//     } else {
//       this.roles.push(role);
//     }

//     this.closeModal();
//   }
  
//   toggleDropdown() {
//   this.showPermissionDropdown = !this.showPermissionDropdown;
// }

//   closeModal() {
//     this.showModal = false;
//     this.editingIndex = null;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService, Module, Role } from '../../../core/services/role.service';

export interface TableEntry {
  id: number;
  roleId: number;
  roleName: string;
  description: string;
  moduleIds: number[];
}

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss'
})
export class RolesListComponent implements OnInit {

  // API data
  allRoles: Role[] = [];         // /api/roles → Role dropdown
  allModules: Module[] = [];     // /api/modules → Permission dropdown

  // Table rows (saved entries)
  tableEntries: TableEntry[] = [];

  // Loading states
  loadingRoles = false;
  loadingModules = false;
  loadingTableRoles = false;
  saving = false;

  // Modal state
  showModal = false;
  editingRole: TableEntry | null = null;
  showPermissionDropdown = false;

  // Form
  form = {
    roleId: '' as number | '',
    description: '',
    selectedModuleIds: [] as number[],
  };

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    this.loadRoles();
    this.loadModules();
    this.loadTableEntries();
  }

  // Load roles for dropdown (/api/roles)
  loadRoles() {
    this.loadingRoles = true;
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.allRoles = data;
        this.loadingRoles = false;
      },
      error: (err) => {
        console.error('Roles load failed', err);
        this.loadingRoles = false;
      }
    });
  }

  // Load modules for permission dropdown (/api/modules)
  loadModules() {
    this.loadingModules = true;
    this.roleService.getModules().subscribe({
      next: (data) => {
        this.allModules = data;
        this.loadingModules = false;
      },
      error: (err) => {
        console.error('Modules load failed', err);
        this.loadingModules = false;
      }
    });
  }

  // Load saved role-permission entries for table
  loadTableEntries() {
    this.loadingTableRoles = true;
    this.roleService.getRolePermissions().subscribe({
      next: (data) => {
        this.tableEntries = data;
        this.loadingTableRoles = false;
      },
      error: (err) => {
        console.error('Table entries load failed', err);
        this.loadingTableRoles = false;
      }
    });
  }

  // Get single module name by ID
  getModuleName(id: number): string {
    return this.allModules.find(m => m.id === id)?.name ?? `Module ${id}`;
  }

  // Get comma-separated module names for table cell
  getModuleNames(ids: number[]): string {
    if (!ids?.length) return '—';
    return ids.map(id => this.getModuleName(id)).join(', ');
  }

  // Get role name by ID
  getRoleName(id: number | ''): string {
    if (!id) return '';
    return this.allRoles.find(r => r.id === id)?.name ?? `Role ${id}`;
  }

  openAdd() {
    this.form = { roleId: '', description: '', selectedModuleIds: [] };
    this.editingRole = null;
    this.showPermissionDropdown = false;
    this.showModal = true;
  }

  openEdit(entry: TableEntry) {
    this.form = {
      roleId: entry.roleId,
      description: entry.description,
      selectedModuleIds: [...entry.moduleIds]
    };
    this.editingRole = entry;
    this.showPermissionDropdown = false;
    this.showModal = true;
  }

  onModuleToggle(event: any) {
    const id = +event.target.value;
    if (event.target.checked) {
      this.form.selectedModuleIds.push(id);
    } else {
      this.form.selectedModuleIds = this.form.selectedModuleIds.filter(m => m !== id);
    }
  }

  isModuleSelected(id: number): boolean {
    return this.form.selectedModuleIds.includes(id);
  }

  toggleDropdown() {
    this.showPermissionDropdown = !this.showPermissionDropdown;
  }

  save() {
    if (!this.form.roleId) return;
    this.saving = true;

    const payload = {
      roleId: this.form.roleId as number,
      roleName: this.getRoleName(this.form.roleId),
      description: this.form.description.trim(),
      moduleIds: this.form.selectedModuleIds
    };

    if (this.editingRole !== null) {
      this.roleService.updateRolePermission(this.editingRole.id, payload).subscribe({
        next: () => {
          this.loadTableEntries();
          this.closeModal();
          this.saving = false;
        },
        error: (err) => {
          console.error('Update failed', err);
          this.saving = false;
        }
      });
    } else {
      this.roleService.createRolePermission(payload).subscribe({
        next: () => {
          this.loadTableEntries();
          this.closeModal();
          this.saving = false;
        },
        error: (err) => {
          console.error('Create failed', err);
          this.saving = false;
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingRole = null;
    this.showPermissionDropdown = false;
  }
}







