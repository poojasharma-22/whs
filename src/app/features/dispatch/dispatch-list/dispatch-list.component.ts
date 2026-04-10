import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Parcel, Driver, Outlet, Product } from '../../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dispatch-list',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './dispatch-list.component.html',
  styleUrl: './dispatch-list.component.scss'
})
export class DispatchListComponent {
  parcels: Parcel[] = [];
  drivers: Driver[] = [];
  outlets: Outlet[] = [];
  products: Product[] = [];
  activeTab: 'ready' | 'dispatched' = 'ready';
  showAssignDriver: number | null = null;
  selectedDriverId: number | null = null;
  showProductDetails: Parcel | null = null;
  ewayParcel: Parcel | null = null;

  get readyParcels(): Parcel[] {
    return this.parcels.filter(p => p.status !== 'dispatched' && p.status !== 'delivered');
  }

  get dispatchedParcels(): Parcel[] {
    return this.parcels.filter(p => p.status === 'dispatched' || p.status === 'delivered');
  }

  constructor(private api: ApiService) {
    this.load();
    this.api.getDrivers().subscribe(d => this.drivers = d);
    this.api.getOutlets().subscribe(o => this.outlets = o);
    this.api.getProducts().subscribe(p => this.products = p);
  }

  load() {
    this.api.getParcels().subscribe(list => this.parcels = list);
  }

  outletName(id: number): string {
    return this.outlets.find(o => o.id === id)?.name ?? '–';
  }

  driverName(id: number | null): string {
    if (!id) return '–';
    return this.drivers.find(d => d.id === id)?.name ?? '–';
  }

  productNames(ids: number[]): string {
    return ids.map(id => this.products.find(p => p.id === id)?.productName ?? id).join(', ');
  }

  openProductDetails(parcel: Parcel) {
    this.showProductDetails = parcel;
  }

  get parcelProductsList(): Product[] {
    if (!this.showProductDetails) return [];
    return this.showProductDetails.productIds
      .map(id => this.products.find(p => p.id === id))
      .filter((p): p is Product => p != null);
  }

  openEwayBill(parcel: Parcel) {
    this.ewayParcel = parcel;
  }

  assignDriver(parcelId: number) {
    this.showAssignDriver = parcelId;
    this.selectedDriverId = null;
  }

  confirmAssignDriver() {
    if (this.showAssignDriver == null || !this.selectedDriverId) return;
    this.api.updateParcel(this.showAssignDriver, { driverId: this.selectedDriverId, status: 'dispatched', dispatchedAt: new Date().toISOString() }).subscribe(() => {
      this.showAssignDriver = null;
      this.selectedDriverId = null;
      this.load();
    });
  }

  createParcelFromPicked() {
    this.api.getProducts().subscribe(products => {
      const picked = products.filter(p => p.status === 'picked');
      const byOutlet = new Map<number, Product[]>();
      picked.forEach(p => {
        if (p.outletId) {
          const arr = byOutlet.get(p.outletId) || [];
          arr.push(p);
          byOutlet.set(p.outletId, arr);
        }
      });
      byOutlet.forEach((prods, outletId) => {
        const eway = 'EWB' + Date.now() + '-' + outletId;
        this.api.addParcel({
          outletId,
          productIds: prods.map(p => p.id),
          driverId: null,
          status: 'ready_for_dispatch',
          ewayBillNumber: eway,
          createdAt: new Date().toISOString(),
          dispatchedAt: null
        }).subscribe(() => {
          prods.forEach(p => this.api.updateProduct(p.id, { status: 'dispatched' }).subscribe());
          this.load();
        });
      });
    });
  }
}
