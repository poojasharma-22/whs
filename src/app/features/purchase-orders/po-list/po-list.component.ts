import { Component } from '@angular/core';
import { DatePipe, TitleCasePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { PdfParserService } from '../../../core/services/parser.service';

interface MockPO {
  id: number;
  poNumber: string;
  vendorName: string;
  fileName: string;
  uploadedAt: string;
  qty: number;
  received: number;
  invoiceCount: number;
  status: 'pending' | 'in_progress' | 'completed';
}

@Component({
  selector: 'app-po-list',
  standalone: true,
  imports: [DatePipe, NgIf],
  templateUrl: './po-list.component.html',
  styleUrl: './po-list.component.scss',
})
export class PoListComponent {
  uploading = false;
  uploadSuccess = false;

  purchaseOrders: MockPO[] = [
    {
      id: 1,
      poNumber: 'PO-2025-00042',
      vendorName: 'Samsung India Pvt Ltd',
      fileName: 'samsung_po_april.pdf',
      uploadedAt: new Date().toISOString(),
      qty: 120,
      received: 80,
      invoiceCount: 2,
      status: 'in_progress',
    },
    {
      id: 2,
      poNumber: 'PO-2025-00043',
      vendorName: 'Apple Distribution',
      fileName: 'apple_po_april.pdf',
      uploadedAt: new Date().toISOString(),
      qty: 60,
      received: 0,
      invoiceCount: 0,
      status: 'pending',
    },
  ];

  constructor(
    private router: Router,
    private pdfParser: PdfParserService,
  ) {}

  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    this.uploading = true;
    this.uploadSuccess = false;
    input.value = '';

    try {
      //  PdfParserService se parse karo
      const parsed = await this.pdfParser.parsePO(file);
      console.log('Parsed PO:', parsed); // debug

      const newPO: MockPO = {
        id: this.purchaseOrders.length + 1,
        poNumber: parsed.poNumber || this.generatePoNumber(),
        vendorName: parsed.vendorName || '—',
        fileName: file.name,
        uploadedAt: parsed.date || new Date().toISOString(),
        qty: parsed.totalQty,
        received: 0,
        invoiceCount: 0,
        status: 'pending',
      };

      this.purchaseOrders = [newPO, ...this.purchaseOrders];
      this.uploadSuccess = true;
      setTimeout(() => (this.uploadSuccess = false), 3000);
    } catch (err) {
      console.error('PDF parse error:', err);
    } finally {
      this.uploading = false;
    }
  }

  private generatePoNumber(): string {
    const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
    return `PO-${new Date().getFullYear()}-${seq}`;
  }

  viewInvoices(po: MockPO) {
    this.router.navigate(['/intake/invoices']);
  }
}
