import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Outlet } from '../../../models';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent {
  stores: Outlet[] = [];
  showModal = false;
  editingId: number | null = null;
  name = '';
  code = '';
  address = '';
  saving = false;
  fileInput: HTMLInputElement | null = null;

  constructor(private api: ApiService) {
    this.load();
  }

  load() {
    this.api.getOutlets().subscribe(list => this.stores = list);
  }

  downloadSample() {
    const headers = 'Name,Code,Address';
    const sample = 'Chennai Central,OUT-CHE-01,123 MG Road Chennai 600034';
    const csv = headers + '\n' + sample;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'stores_sample.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  onBulkFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleBulkFile(file);
    input.value = '';
  }

  handleBulkFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) return;
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const rows: { name: string; code: string; address: string }[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, j) => row[h] = values[j] || '');
        const name = (row['name'] || row['store name'] || '').trim();
        if (!name) continue;
        rows.push({
          name,
          code: (row['code'] || '').trim(),
          address: (row['address'] || '').trim(),
        });
      }
      if (rows.length === 0) return;
      let done = 0;
      rows.forEach(payload => {
        this.api.addOutlet(payload).subscribe({
          next: () => { done++; if (done === rows.length) this.load(); },
          error: () => { done++; if (done === rows.length) this.load(); },
        });
      });
    };
    reader.readAsText(file);
  }

  openAdd() {
    this.editingId = null;
    this.name = '';
    this.code = '';
    this.address = '';
    this.showModal = true;
  }

  openEdit(s: Outlet) {
    this.editingId = s.id;
    this.name = s.name;
    this.code = s.code;
    this.address = s.address ?? '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (!this.name?.trim()) return;
    this.saving = true;
    const payload = {
      name: this.name.trim(),
      code: (this.code || '').trim(),
      address: (this.address || '').trim(),
    };
    const obs = this.editingId
      ? this.api.updateOutlet(this.editingId, payload)
      : this.api.addOutlet(payload);
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
