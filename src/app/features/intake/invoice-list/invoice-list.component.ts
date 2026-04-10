// import { Component } from '@angular/core';
// import { DatePipe } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { ApiService } from '../../../core/api.service';
// import { Invoice } from '../../../models';

// @Component({
//   selector: 'app-invoice-list',
//   standalone: true,
//   imports: [DatePipe, RouterLink],
//   templateUrl: './invoice-list.component.html',
//   styleUrl: './invoice-list.component.scss'
// })
// export class InvoiceListComponent {
//   invoices: Invoice[] = [];
//   uploading = false;
//   selectedFile: File | null = null;

//   constructor(private api: ApiService) {
//     this.load();
//   }

//   load() {
//     this.api.getInvoices().subscribe(list => this.invoices = list);
//   }

//   /** URL for invoice PDF download (backend may serve file at this path) */
//   invoiceDownloadUrl(inv: Invoice): string {
//     return `/api/invoices/${inv.id}/file`;
//   }

//   onFileSelect(event: Event) {
//     const input = event.target as HTMLInputElement;
//     const file = input.files?.[0];
//     if (file && file.type === 'application/pdf') {
//       this.selectedFile = file;
//       this.upload();
//     }
//     input.value = '';
//   }

//   private generateInvoiceNumber(): string {
//     const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     const prefix = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * 26)]).join('');
//     const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
//     return `INV-${prefix}-${seq}`;
//   }

//   upload() {
//     if (!this.selectedFile) return;
//     this.uploading = true;
//     const invoiceNumber = this.generateInvoiceNumber();
//     const invoice = {
//       invoiceNumber,
//       fileName: this.selectedFile.name,
//       uploadedAt: new Date().toISOString(),
//       status: 'New'
//     };
//     this.api.addInvoice(invoice).subscribe({
//       next: () => {
//         this.uploading = false;
//         this.selectedFile = null;
//         this.load();
//       },
//       error: () => { this.uploading = false; }
//     });
//   }
// }



import { Component } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

interface MockInvoice {
  id: number;
  invoiceNumber: string;
  fileName: string;
  uploadedAt: string;
  qty: number;
  status: string;
}

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [DatePipe, NgIf, RouterLink],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent {
  uploading = false;
  uploadSuccess = false;

  invoices: MockInvoice[] = [
    {
      id: 1,
      invoiceNumber: 'INV-SAM-00123',
      fileName: 'samsung_invoice_1.pdf',
      uploadedAt: new Date().toISOString(),
      qty: 40,
      status: 'pending'
    },
    {
      id: 2,
      invoiceNumber: 'INV-SAM-00124',
      fileName: 'samsung_invoice_2.pdf',
      uploadedAt: new Date().toISOString(),
      qty: 40,
      status: 'pending'
    }
  ];

  invoiceDownloadUrl(inv: MockInvoice): string {
    return `#`;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.uploading = true;
      this.uploadSuccess = false;

      const newInvoice: MockInvoice = {
        id: this.invoices.length + 1,
        invoiceNumber: this.generateInvoiceNumber(),
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        qty: 0,
        status: 'pending'
      };

      setTimeout(() => {
        this.invoices = [newInvoice, ...this.invoices];
        this.uploading = false;
        this.uploadSuccess = true;
        setTimeout(() => this.uploadSuccess = false, 3000);
      }, 1500);
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
}