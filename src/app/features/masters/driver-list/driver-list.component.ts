import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Driver } from '../../../models';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.scss'
})
export class DriverListComponent {
  drivers: Driver[] = [];
  showModal = false;
  editingId: number | null = null;
  username = '';
  name = '';
  email = '';
  phone = '';
  vehicleNumber = '';
  saving = false;

  constructor(private api: ApiService) {
    this.load();
  }

  load() {
    this.api.getDrivers().subscribe(list => this.drivers = list);
  }

  openAdd() {
    this.editingId = null;
    this.username = '';
    this.name = '';
    this.email = '';
    this.phone = '';
    this.vehicleNumber = '';
    this.showModal = true;
  }

  openEdit(d: Driver) {
    this.editingId = d.id;
    this.username = d.username ?? '';
    this.name = d.name;
    this.email = d.email ?? '';
    this.phone = d.phone;
    this.vehicleNumber = d.vehicleNumber;
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
      vehicleNumber: (this.vehicleNumber || '').trim(),
    };
    const obs = this.editingId
      ? this.api.updateDriver(this.editingId, payload)
      : this.api.addDriver(payload);
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
