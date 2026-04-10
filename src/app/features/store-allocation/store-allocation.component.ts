import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, Outlet } from '../../models';
import { ApiService } from '../../core/services/api.service';

interface ProductGroup {
  key: string;
  productName: string;
  brand: string;
  ram: string;
  storage: string;
  binNumber: number;
  totalQty: number;
  productIds: number[];
}

interface StoreRow {
  store: Outlet;
  qty: number;
}

@Component({
  selector: 'app-store-allocation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './store-allocation.component.html',
  styleUrl: './store-allocation.component.scss'
})
export class StoreAllocationComponent {
  products: Product[] = [];
  stores: Outlet[] = [];
  productGroups: ProductGroup[] = [];
  storeRows: StoreRow[] = [];

  selectedProductKey = '';
  selectedGroup: ProductGroup | null = null;
  allocations: Map<number, number> = new Map();

  constructor(private api: ApiService) {
    this.api.getOutlets().subscribe(list => {
      this.stores = list;
      this.buildStoreRows();
    });
    this.api.getProducts().subscribe(list => {
      this.products = list;
      this.buildProductGroups();
    });
  }

  private buildProductGroups() {
    const map = new Map<string, ProductGroup>();
    for (const p of this.products) {
      if (p.binNumber == null) continue;
      const key = `${p.productName}|${p.ram}|${p.storage}|${p.binNumber}`;
      const pQty = p.qty || 1;
      const existing = map.get(key);
      if (existing) {
        existing.totalQty += pQty;
        existing.productIds.push(p.id);
      } else {
        map.set(key, {
          key,
          productName: p.productName,
          brand: p.brand,
          ram: p.ram,
          storage: p.storage,
          binNumber: p.binNumber,
          totalQty: pQty,
          productIds: [p.id]
        });
      }
    }
    this.productGroups = Array.from(map.values()).sort((a, b) => a.productName.localeCompare(b.productName));
  }

  get productOptions(): { key: string; label: string; totalQty: number }[] {
    return this.productGroups.map(g => ({
      key: g.key,
      label: `${g.brand} ${g.productName} ${g.ram}/${g.storage} — Bin ${g.binNumber}`,
      totalQty: g.totalQty
    }));
  }

  onProductSelected() {
    this.selectedGroup = this.productGroups.find(g => g.key === this.selectedProductKey) ?? null;
    this.allocations = new Map();
    this.buildStoreRows();
  }

  private buildStoreRows() {
    this.storeRows = this.stores.map(s => ({
      store: s,
      qty: this.allocations.get(s.id) ?? 0
    }));
  }

  onQtyChange(storeId: number, value: number) {
    const qty = Math.max(0, Math.floor(value || 0));
    this.allocations.set(storeId, qty);
    const row = this.storeRows.find(r => r.store.id === storeId);
    if (row) row.qty = qty;
  }

  get totalAllocated(): number {
    let sum = 0;
    this.allocations.forEach(v => sum += v);
    return sum;
  }

  get pendingAllocation(): number {
    if (!this.selectedGroup) return 0;
    return this.selectedGroup.totalQty - this.totalAllocated;
  }
}
