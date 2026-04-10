import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-add-item-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-item-form.component.html',
  styleUrl: './add-item-form.component.scss'
})
export class AddItemFormComponent {
  @Input() invoiceId = 0;
  @Output() added = new EventEmitter<void>();

  model = {
    brand: '',
    productName: '',
    model: '',
    imei: '',
    colour: '',
    ram: '',
    storage: '',
    qty: 1,
    hsnCode: '',
    sku: '',
    barcode: ''
  };
  saving = false;

  brandOptions = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'Oppo', 'Realme', 'Motorola', 'Nokia', 'Google'];

  modelOptions: Record<string, string[]> = {
    Apple: ['A2649', 'A3090', 'A2890', 'A2894', 'A3092'],
    Samsung: ['SM-A546', 'SM-S928B', 'SM-A156B', 'SM-A256B', 'SM-S711B'],
    OnePlus: ['CPH2493', 'CPH2551', 'NE2215', 'CPH2599', 'IV2201'],
    Xiaomi: ['2311DRK48G', '23106RN0DA', '2407FPN8EG', '23076RN4BI', '2312DRAAEG'],
    Vivo: ['V2247', 'V2316', 'V2310', 'V2254', 'V2303'],
    Oppo: ['CPH2603', 'CPH2643', 'CPH2579', 'CPH2625', 'CPH2635'],
    Realme: ['RMX3771', 'RMX3761', 'RMX3686', 'RMX3782', 'RMX3834'],
    Motorola: ['XT2343-1', 'XT2347-2', 'XT2303-4', 'XT2345-5', 'XT2381-1'],
    Nokia: ['TA-1577', 'TA-1579', 'TA-1581', 'TA-1583', 'TA-1585'],
    Google: ['GVU6C', 'G82U8', 'GKWS6', 'G1MNW', 'GP4BC']
  };

  colourOptions = ['Black', 'White', 'Blue', 'Violet', 'Midnight', 'Midnight Black', 'Silver', 'Gold', 'Green',
    'Misty Green', 'Tempest Gray', 'Aurora Purple', 'Himalayan Blue', 'Rock Grey', 'Red', 'Starlight',
    'Cream', 'Lavender', 'Graphite', 'Natural Titanium'];

  ramOptions = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];

  storageOptions = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];

  get currentModelOptions(): string[] {
    return this.modelOptions[this.model.brand] || [];
  }

  constructor(private api: ApiService) {}

  onBrandChange() {
    this.model.model = '';
  }

  submit() {
    this.saving = true;
    const payload = {
      invoiceId: this.invoiceId,
      ...this.model,
      binNumber: null,
      outletId: null,
      status: 'in_stock',
      barcode: this.model.barcode || this.model.imei
    };
    this.api.addProduct(payload).subscribe({
      next: () => {
        this.saving = false;
        this.model = { brand: '', productName: '', model: '', imei: '', colour: '', ram: '', storage: '', qty: 1, hsnCode: '', sku: '', barcode: '' };
        this.added.emit();
      },
      error: () => { this.saving = false; }
    });
  }

  cancel() {
    this.added.emit();
  }
}
