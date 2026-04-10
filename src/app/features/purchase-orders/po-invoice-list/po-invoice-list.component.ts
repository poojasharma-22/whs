import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe, NgIf } from '@angular/common';
import { ApiService } from '../../../core/api.service';
import { POInvoice } from '../../../models';

@Component({
  selector: 'app-po-invoice-list',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, NgIf, RouterLink],
  templateUrl: './po-invoice-list.component.html',
  styleUrl: './po-invoice-list.component.scss'
})
export class PoInvoiceListComponent {
  poId = 0;
  poNumber = '';
  poPdfName = '';
  poStatus = '';
  invoices: POInvoice[] = [];
  uploading = false;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.poId = Number(this.route.snapshot.paramMap.get('poId'));
    this.loadPo();
    this.loadInvoices();
  }

  loadPo() {
    // PO ka detail load karo — number, pdf name, status header mein dikhane ke liye
    this.api.getPurchaseOrder(this.poId).subscribe(po => {
      if (po) {
        this.poNumber  = po.poNumber;
        this.poPdfName = po.fileName;
        this.poStatus  = po.status;
      }
    });
  }

  loadInvoices() {
    this.api.getPoInvoices(this.poId).subscribe(list => this.invoices = list);
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.upload(file);
    }
    input.value = '';
  }

  private generateInvoiceNumber(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix = Array.from({ length: 3 }, () =>
      letters[Math.floor(Math.random() * 26)]
    ).join('');
    const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
    return `INV-${prefix}-${seq}`;
  }

  private upload(file: File) {
    this.uploading = true;
    const invoice: Partial<POInvoice> = {
      poId: this.poId,                        // ← yeh link karta hai PO se
      invoiceNumber: this.generateInvoiceNumber(),
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      status: 'pending'
    };

    this.api.addPoInvoice(invoice).subscribe({
      next: () => {
        this.uploading = false;
        this.loadInvoices();
      },
      error: () => { this.uploading = false; }
    });
  }
}