import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms'

interface RoleEntry {
  icon: string;
  name: string;
  permissions: string; // still string for display
}

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss'
})
export class RolesListComponent {
  // ✅ NEW: master permission list
  allPermissions: string[] = [
    'Dashboard',
    'Purchase Orders',
    'Product Intake',
    'Stock & Bin Assignment',
    'Store Allocation',
    'Picker',
    'Dispatch',
    'Tracking',
    'Store Receiving',
    'Reports',
    'Masters',
    'Notifications'
  ];

  roles: RoleEntry[] = [
    {
      icon: '👑',
      name: 'Super Admin',
      permissions: 'Dashboard, Purchase Orders, Reports'
    }
  ];

  showModal = false;
  editingIndex: number | null = null;
  showPermissionDropdown = false;

  // UPDATED FORM KER Diye
  form = {
    icon: '',
    name: '',
    selectedPermissions: [] as string[],
    customPermissions: ''
  };

  //  ADD MODE KIYA
  openAdd() {
    this.form = {
      icon: '',
      name: '',
      selectedPermissions: [],
      customPermissions: ''
    };
    this.editingIndex = null;
    this.showPermissionDropdown = false;
    this.showModal = true;
    
  }

  //  EDIT MODE (important logic)
  openEdit(index: number) {
    const role = this.roles[index];

    const permsArray = role.permissions.split(',').map(p => p.trim());

    this.form = {
      icon: role.icon,
      name: role.name,
      selectedPermissions: permsArray.filter(p =>
        this.allPermissions.includes(p)
      ),
      customPermissions: permsArray
        .filter(p => !this.allPermissions.includes(p))
        .join(', ')
    };

    this.editingIndex = index;
    this.showPermissionDropdown = false; 
    this.showModal = true;
  }

  //  CHECKBOX HANDLER
  onPermissionToggle(event: any) {
    const value = event.target.value;

    if (event.target.checked) {
      this.form.selectedPermissions.push(value);
    } else {
      this.form.selectedPermissions =
        this.form.selectedPermissions.filter(p => p !== value);
    }
  }

  //  SAVE LOGIC (MERGE BOTH)
  save() {
    if (!this.form.name?.trim()) return;

    const custom = this.form.customPermissions
      ? this.form.customPermissions.split(',').map(p => p.trim())
      : [];

    const finalPermissions = [
      ...this.form.selectedPermissions,
      ...custom
    ];

    const role: RoleEntry = {
      icon: this.form.icon,
      name: this.form.name,
      permissions: finalPermissions.join(', ')
    };

    if (this.editingIndex !== null) {
      this.roles[this.editingIndex] = role;
    } else {
      this.roles.push(role);
    }

    this.closeModal();
  }
  
  toggleDropdown() {
  this.showPermissionDropdown = !this.showPermissionDropdown;
}

  closeModal() {
    this.showModal = false;
    this.editingIndex = null;
  }
}