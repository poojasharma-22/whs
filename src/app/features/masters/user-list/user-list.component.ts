import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { User, UserRole } from '../../../models';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'picker', label: 'Picker' },
  { value: 'driver', label: 'Driver' },
  { value: 'store_staff', label: 'Store Staff' },
  { value: 'dispatch_manager', label: 'Dispatch Manager' },
];

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  users: User[] = [];
  roles = ROLES;
  showModal = false;
  editingId: number | null = null;
  username = '';
  name = '';
  email = '';
  role: UserRole = 'picker';
  active = true;
  saving = false;

  constructor(private api: ApiService) {
    this.load();
  }

  load() {
    this.api.getUsers().subscribe(list => this.users = list);
  }

  openAdd() {
    this.editingId = null;
    this.username = '';
    this.name = '';
    this.email = '';
    this.role = 'picker';
    this.active = true;
    this.showModal = true;
  }

  openEdit(u: User) {
    this.editingId = u.id;
    this.username = u.username;
    this.name = u.name;
    this.email = u.email;
    this.role = u.role;
    this.active = u.active;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.username?.trim() || !this.name?.trim()) return;
    this.saving = true;
    const payload = {
      username: this.username.trim(),
      name: this.name.trim(),
      email: (this.email || '').trim(),
      role: this.role,
      active: this.active,
    };
    const obs = this.editingId
      ? this.api.updateUser(this.editingId, payload)
      : this.api.addUser(payload);
    obs.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.load();
      },
      error: () => { this.saving = false; },
    });
  }

  roleLabel(role: UserRole): string {
    return this.roles.find(r => r.value === role)?.label ?? role;
  }
}
