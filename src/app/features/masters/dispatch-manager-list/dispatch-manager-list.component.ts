import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { DispatchManager } from '../../../models';

@Component({
  selector: 'app-dispatch-manager-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dispatch-manager-list.component.html',
  styleUrl: './dispatch-manager-list.component.scss',
})
export class DispatchManagerListComponent {
  managers: DispatchManager[] = [];
  showModal = false;
  editingId: number | null = null;
  username = '';
  name = '';
  email = '';
  phone = '';
  code = '';
  saving = false;

  constructor(private api: ApiService) {
    this.load();
  }

  load() {
    this.api.getDispatchManagers().subscribe((list) => (this.managers = list));
  }

  openAdd() {
    this.editingId = null;
    this.username = '';
    this.name = '';
    this.email = '';
    this.phone = '';
    this.code = '';
    this.showModal = true;
  }

  openEdit(m: DispatchManager) {
    this.editingId = m.id;
    this.username = m.username ?? '';
    this.name = m.name;
    this.email = m.email ?? '';
    this.phone = m.phone;
    this.code = m.code;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.name?.trim() || !this.username?.trim()) return;
    this.saving = true;
    const payload = {
      username: this.username.trim(),
      name: this.name.trim(),
      email: (this.email || '').trim(),
      phone: (this.phone || '').trim(),
      code: (this.code || '').trim(),
    };
    const obs = this.editingId
      ? this.api.updateDispatchManager(this.editingId, payload)
      : this.api.addDispatchManager(payload);
    obs.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.load();
      },
      error: () => {
        this.saving = false;
      },
    });
  }
}
