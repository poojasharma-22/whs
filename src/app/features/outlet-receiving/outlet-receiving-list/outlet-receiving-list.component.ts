import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../../../models';

@Component({
  selector: 'app-outlet-receiving-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './outlet-receiving-list.component.html',
  styleUrl: './outlet-receiving-list.component.scss'
})
export class OutletReceivingListComponent {
  products: Product[] = [];
  binFilter: number | null = null;
  brandFilter = '';
  searchText = '';

  constructor(private api: ApiService) {
    this.api.getProducts().subscribe(list => {
      this.products = list.filter(p => p.binNumber != null && p.outletId != null);
    });
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
}
