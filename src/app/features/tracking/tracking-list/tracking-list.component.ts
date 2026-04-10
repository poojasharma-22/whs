import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Transfer, Deviation } from '../../../models';
import { TrackDriverModalComponent } from '../track-driver-modal/track-driver-modal.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-tracking-list',
  standalone: true,
  imports: [DatePipe, TrackDriverModalComponent],
  templateUrl: './tracking-list.component.html',
  styleUrl: './tracking-list.component.scss'
})
export class TrackingListComponent {
  transfers: Transfer[] = [];
  deviations: Deviation[] = [];
  activeTab: 'tracking' | 'deviations' = 'tracking';
  trackTransferId: number | null = null;

  constructor(private api: ApiService) {
    this.loadTracking();
    this.api.getDeviations().subscribe(list => this.deviations = list);
  }

  loadTracking() {
    this.api.getParcels().subscribe(parcels => {
      const withDriver = parcels.filter(p => p.driverId && (p.status === 'dispatched' || p.status === 'in_transit'));
      const transferMap = new Map<number, Transfer>();
      withDriver.forEach(p => {
        transferMap.set(p.id, {
          id: p.id,
          outletId: p.outletId,
          outletName: '',
          driverId: p.driverId!,
          driverName: '',
          parcelCount: 1,
          productCount: p.productIds?.length || 0,
          dispatchDate: p.dispatchedAt ? p.dispatchedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
          status: p.status
        });
      });
      this.api.getOutlets().subscribe(outlets => {
        this.api.getDrivers().subscribe(drivers => {
          this.transfers = Array.from(transferMap.values()).map(t => ({
            ...t,
            outletName: outlets.find(o => o.id === t.outletId)?.name ?? '–',
            driverName: drivers.find(d => d.id === t.driverId)?.name ?? '–'
          }));
        });
      });
    });
  }

  openTrack(transferId: number) {
    this.trackTransferId = transferId;
  }

  closeTrack() {
    this.trackTransferId = null;
  }

  markRead(d: Deviation) {
    if (d.read) return;
    this.api.markDeviationRead(d.id).subscribe(() => {
      d.read = true;
    });
  }
}
