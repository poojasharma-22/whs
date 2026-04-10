import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product, Invoice } from '../../../models';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AddItemFormComponent } from '../../../features/intake/add-item-form/add-item-form.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule, AddItemFormComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  invoiceId = 0;
  invoiceNumber = '';
  products: Product[] = [];
  showAddForm = false;
  fileInput: HTMLInputElement | null = null;
  filterBrand = '';
  filterProduct = '';
  filterColour = '';
  searchText = '';
  editingQtyId: number | null = null;
  editingQtyValue = 1;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.invoiceId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
    this.api.getInvoices().subscribe((list) => {
      const inv = list.find((i: Invoice) => i.id === this.invoiceId);
      this.invoiceNumber = inv?.invoiceNumber ?? `#${this.invoiceId}`;
    });
  }

  load() {
    this.api
      .getProducts(this.invoiceId)
      .subscribe((list) => (this.products = list));
  }

  get assignedCount(): number {
    return this.products.filter(
      (p) =>
        p.status === 'assigned' ||
        p.status === 'picked' ||
        p.status === 'dispatched' ||
        p.status === 'received'
    ).length;
  }

  get brandOptions(): string[] {
    const set = new Set(this.products.map((p) => p.brand).filter(Boolean));
    return Array.from(set).sort();
  }

  get productNameOptions(): string[] {
    const set = new Set(
      this.products.map((p) => p.productName).filter(Boolean)
    );
    return Array.from(set).sort();
  }

  get colourOptions(): string[] {
    const set = new Set(this.products.map((p) => p.colour).filter(Boolean));
    return Array.from(set).sort();
  }

  get filteredProducts(): Product[] {
    let list = this.products;
    if (this.filterBrand)
      list = list.filter((p) => p.brand === this.filterBrand);
    if (this.filterProduct)
      list = list.filter((p) => p.productName === this.filterProduct);
    if (this.filterColour)
      list = list.filter((p) => p.colour === this.filterColour);
    const q = (this.searchText || '').trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          (p.productName && p.productName.toLowerCase().includes(q)) ||
          (p.imei && p.imei.toLowerCase().includes(q))
      );
    }
    return list;
  }

  triggerBulkUpload() {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = '.csv,.xlsx';
    this.fileInput.onchange = () =>
      this.handleBulkFile(this.fileInput!.files![0]);
    this.fileInput.click();
  }

  handleBulkFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      const headers = lines[0]
        .toLowerCase()
        .split(',')
        .map((h) => h.trim());
      const products: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const row: any = {};
        headers.forEach((h, j) => (row[h] = values[j] || ''));
        products.push({
          invoiceId: this.invoiceId,
          brand: row.brand || '',
          productName: row.productname || row['product name'] || '',
          model: row.model || '',
          imei: row.imei || '',
          colour: row.colour || row.color || '',
          ram: row.ram || '',
          storage: row.storage || '',
          qty: parseInt(row.qty, 10) || 1,
          hsnCode: row.hsncode || row['hsn code'] || '',
          sku: row.sku || '',
          binNumber: null,
          outletId: null,
          status: 'in_stock',
          barcode: row.barcode || row.imei || '',
        });
      }
      products.forEach((p) => {
        this.api.addProduct(p).subscribe(() => this.load());
      });
    };
    reader.readAsText(file);
    if (this.fileInput) this.fileInput.remove();
  }

  downloadSample() {
    const headers =
      'Brand,Product Name,Model,IMEI,Colour,RAM,Storage,HSN Code,SKU,Barcode';
    const sample =
      'Samsung,Galaxy A54,SM-A546,351234567890123,Black,8 GB,128 GB,8517,SAM-A54-BLK-128,8901234567890';
    const csv = headers + '\n' + sample;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'products_sample.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  onItemAdded() {
    this.showAddForm = false;
    this.load();
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
      error: () => {
        this.editingQtyId = null;
      },
    });
  }

  cancelEditQty() {
    this.editingQtyId = null;
  }
}
