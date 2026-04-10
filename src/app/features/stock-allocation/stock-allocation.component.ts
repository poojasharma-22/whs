import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Product, Invoice } from '../../models';
import { AssignBinModalComponent } from '../intake/assign-bin-modal/assign-bin-modal.component';

@Component({
  selector: 'app-stock-allocation',
  standalone: true,
  imports: [FormsModule, AssignBinModalComponent],
  templateUrl: './stock-allocation.component.html',
  styleUrl: './stock-allocation.component.scss'
})
export class StockAllocationComponent {
  products: Product[] = [];
  invoiceMap: Map<number, string> = new Map();
  selectedId: number | null = null;

  showAssignBin = false;

  filterBrand = '';
  filterProduct = '';
  filterColour = '';
  filterRam = '';
  filterStorage = '';
  searchText = '';
  editingQtyId: number | null = null;
  editingQtyValue = 1;

  constructor(private api: ApiService) {
    this.load();
    this.api.getInvoices().subscribe(list => {
      list.forEach((inv: Invoice) => this.invoiceMap.set(inv.id, inv.invoiceNumber));
    });
  }

  invoiceNumber(invoiceId: number): string {
    return this.invoiceMap.get(invoiceId) ?? `#${invoiceId}`;
  }

  load() {
    this.api.getProducts().subscribe(list => this.products = list);
    this.selectedId = null;
  }

  get brandOptions(): string[] {
    const set = new Set(this.products.map(p => p.brand).filter(Boolean));
    return Array.from(set).sort();
  }

  get productNameOptions(): string[] {
    const set = new Set(this.products.map(p => p.productName).filter(Boolean));
    return Array.from(set).sort();
  }

  get colourOptions(): string[] {
    const set = new Set(this.products.map(p => p.colour).filter(Boolean));
    return Array.from(set).sort();
  }

  get ramOptions(): string[] {
    const set = new Set(this.products.map(p => p.ram).filter(Boolean));
    return Array.from(set).sort();
  }

  get storageOptions(): string[] {
    const set = new Set(this.products.map(p => p.storage).filter(Boolean));
    return Array.from(set).sort();
  }

  get filteredProducts(): Product[] {
    let list = this.products;
    if (this.filterBrand) list = list.filter(p => p.brand === this.filterBrand);
    if (this.filterProduct) list = list.filter(p => p.productName === this.filterProduct);
    if (this.filterColour) list = list.filter(p => p.colour === this.filterColour);
    if (this.filterRam) list = list.filter(p => p.ram === this.filterRam);
    if (this.filterStorage) list = list.filter(p => p.storage === this.filterStorage);
    const q = (this.searchText || '').trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        (p.productName && p.productName.toLowerCase().includes(q)) ||
        (p.imei && p.imei.toLowerCase().includes(q))
      );
    }
    return list;
  }

  get totalCount(): number { return this.products.length; }
  get inStockCount(): number { return this.products.filter(p => p.status === 'in_stock').length; }
  get assignedCount(): number { return this.products.filter(p => p.status !== 'in_stock').length; }

  selectProduct(id: number) {
    this.selectedId = id;
  }

  openAssignBin() {
    if (this.selectedId === null) return;
    this.showAssignBin = true;
  }

  onBinAssigned(binNumber: number) {
    this.showAssignBin = false;
    if (this.selectedId === null) return;
    this.api.updateProduct(this.selectedId, { binNumber }).subscribe({
      next: () => this.load()
    });
  }

  startEditQty(p: Product) {
    this.editingQtyId = p.id;
    this.editingQtyValue = p.qty ?? 1;
  }

  saveQty(p: Product) {
    if (this.editingQtyId !== p.id) return;
    const qty = Math.max(1, Math.floor(Number(this.editingQtyValue)) || 1);
    this.api.updateProduct(p.id, { ...p, qty }).subscribe({
      next: () => {
        this.editingQtyId = null;
        this.load();
      },
      error: () => { this.editingQtyId = null; }
    });
  }

  cancelEditQty() {
    this.editingQtyId = null;
  }
}
