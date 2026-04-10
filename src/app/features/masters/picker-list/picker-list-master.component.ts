import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { Picker } from '../../../models';

@Component({
  selector: 'app-picker-list-master',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './picker-list-master.component.html',
  styleUrl: './picker-list-master.component.scss'
})
export class PickerListMasterComponent {
  pickers: Picker[] = [];
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
    this.api.getPickers().subscribe(list => this.pickers = list);
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

  openEdit(p: Picker) {
    this.editingId = p.id;
    this.username = p.username ?? '';
    this.name = p.name;
    this.email = p.email ?? '';
    this.phone = p.phone;
    this.code = p.code;
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
      ? this.api.updatePicker(this.editingId, payload)
      : this.api.addPicker(payload);
    obs.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.load();
      },
      error: () => { this.saving = false; },
    });
  }
}
