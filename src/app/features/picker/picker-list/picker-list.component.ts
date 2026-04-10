import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { Product, Outlet } from '../../../models';

@Component({
  selector: 'app-picker-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './picker-list.component.html',
  styleUrl: './picker-list.component.scss'
})
export class PickerListComponent {
  products: Product[] = [];
  outlets: Outlet[] = [];
  storeFilter: number | null = null;
  binFilter: number | null = null;
  brandFilter = '';
  searchText = '';

  constructor(private api: ApiService) {
    this.api.getProducts().subscribe(list => {
      this.products = list.filter(p => p.binNumber != null && p.outletId != null);
    });
    this.api.getOutlets().subscribe(list => this.outlets = list);
  }

  get binOptions(): number[] {
    const bins = new Set(this.products.map(p => p.binNumber).filter((b): b is number => b != null));
    return Array.from(bins).sort((a, b) => a - b);
  }

  get brandOptions(): string[] {
    const set = new Set(this.products.map(p => p.brand).filter(Boolean));
    return Array.from(set).sort();
  }

  get filteredProducts(): Product[] {
    let list = this.products;
    if (this.storeFilter != null) {
      list = list.filter(p => p.outletId === this.storeFilter);
    }
    if (this.binFilter != null) {
      list = list.filter(p => p.binNumber === this.binFilter);
    }
    if (this.brandFilter) {
      list = list.filter(p => p.brand === this.brandFilter);
    }
    const q = (this.searchText || '').trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        (p.productName && p.productName.toLowerCase().includes(q)) ||
        (p.imei && p.imei.toLowerCase().includes(q))
      );
    }
    return list;
  }

  outletName(id: number | null): string {
    if (!id) return '–';
    return this.outlets.find(o => o.id === id)?.name ?? '–';
  }
}
