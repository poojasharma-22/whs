import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, Outlet, Parcel } from '../../../models';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

interface ReportRow {
  product: Product;
  storeName: string;
  dispatchDate: string | null;
  receivedDate: string | null;
  ewayBillNumber: string | null;
}

@Component({
  selector: 'app-reports-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reports-view.component.html',
  styleUrl: './reports-view.component.scss'
})
export class ReportsViewComponent {
  reportRows: ReportRow[] = [];
  outlets: Outlet[] = [];

  dateFrom = '';
  dateTo = '';
  brandFilter = '';
  binFilter: number | null = null;
  storeFilter: number | null = null;
  searchText = '';

  constructor(private api: ApiService) {
    const now = new Date();
    this.dateTo = now.toISOString().slice(0, 10);
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    this.dateFrom = start.toISOString().slice(0, 10);
    this.loadReport();
  }

  private loadReport() {
    forkJoin({
      products: this.api.getProducts(),
      outlets: this.api.getOutlets(),
      parcels: this.api.getParcels()
    }).subscribe(({ products, outlets, parcels }) => {
      this.outlets = outlets;

      const outletMap = new Map<string, string>();
      outlets.forEach((o: Outlet) => outletMap.set(String(o.id), o.name));

      const productParcelMap = new Map<string, Parcel>();
      parcels.forEach((parcel: Parcel) => {
        parcel.productIds.forEach(pid => {
          productParcelMap.set(String(pid), parcel);
        });
      });

      this.reportRows = products
        .filter(p => p.binNumber != null)
        .map(p => {
          const parcel = productParcelMap.get(String(p.id));
          let receivedDate: string | null = null;
          if (p.status === 'received' && parcel?.dispatchedAt) {
            const d = new Date(parcel.dispatchedAt);
            d.setDate(d.getDate() + 1);
            receivedDate = d.toISOString().slice(0, 10);
          }
          return {
            product: p,
            storeName: p.outletId ? (outletMap.get(String(p.outletId)) ?? '–') : '–',
            dispatchDate: parcel?.dispatchedAt ? parcel.dispatchedAt.slice(0, 10) : null,
            receivedDate,
            ewayBillNumber: parcel?.ewayBillNumber ?? null
          };
        });
    });
  }

  get brandOptions(): string[] {
    const set = new Set(this.reportRows.map(r => r.product.brand).filter(Boolean));
    return Array.from(set).sort();
  }

  get binOptions(): number[] {
    const set = new Set(this.reportRows.map(r => r.product.binNumber).filter((b): b is number => b != null));
    return Array.from(set).sort((a, b) => a - b);
  }

  get filteredRows(): ReportRow[] {
    let list = this.reportRows;
    if (this.dateFrom) list = list.filter(r => r.dispatchDate != null && r.dispatchDate >= this.dateFrom);
    if (this.dateTo) list = list.filter(r => r.dispatchDate != null && r.dispatchDate <= this.dateTo);
    if (this.brandFilter) list = list.filter(r => r.product.brand === this.brandFilter);
    if (this.binFilter != null) list = list.filter(r => r.product.binNumber === this.binFilter);
    if (this.storeFilter != null) list = list.filter(r => r.product.outletId === this.storeFilter);
    const q = (this.searchText || '').trim().toLowerCase();
    if (q) {
      list = list.filter(r =>
        (r.product.productName && r.product.productName.toLowerCase().includes(q)) ||
        (r.product.imei && r.product.imei.toLowerCase().includes(q))
      );
    }
    return list;
  }

  private buildExportRows(): string[][] {
    const headers = ['Brand', 'Product', 'Model', 'IMEI', 'Colour', 'RAM / Storage', 'Bin', 'Store', 'Dispatch Date', 'Received Date', 'eWay Bill'];
    const rows = this.filteredRows.map(r => [
      r.product.brand,
      r.product.productName,
      r.product.model,
      r.product.imei,
      r.product.colour,
      `${r.product.ram} / ${r.product.storage}`,
      r.product.binNumber != null ? String(r.product.binNumber) : '–',
      r.storeName,
      r.dispatchDate ?? '–',
      r.receivedDate ?? '–',
      r.ewayBillNumber ?? '–'
    ]);
    return [headers, ...rows];
  }

  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  exportCSV() {
    const rows = this.buildExportRows();
    const csv = rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    this.downloadFile(csv, 'product_journey_report.csv', 'text/csv');
  }

  exportExcel() {
    const rows = this.buildExportRows();
    const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Product Journey Report">
    <Table>
${rows.map((row, ri) => `      <Row>${row.map(c =>
  `<Cell><Data ss:Type="String">${this.escapeXml(c)}</Data></Cell>`).join('')}</Row>`).join('\n')}
    </Table>
  </Worksheet>
</Workbook>`;
    this.downloadFile(xml, 'product_journey_report.xls', 'application/vnd.ms-excel');
  }

  exportPDF() {
    const rows = this.buildExportRows();
    const headers = rows[0];
    const dataRows = rows.slice(1);

    const thStyle = 'style="border:1px solid #444;padding:6px 10px;background:#1e293b;color:#fff;font-size:11px;text-align:left"';
    const tdStyle = 'style="border:1px solid #ddd;padding:5px 10px;font-size:11px"';

    const html = `<html><head><title>Product Journey Report</title>
<style>body{font-family:Arial,sans-serif;margin:20px}h1{font-size:18px;margin-bottom:4px}
p{color:#666;font-size:12px;margin:0 0 16px}table{border-collapse:collapse;width:100%}</style>
</head><body>
<h1>Product Journey Report</h1>
<p>Date range: ${this.dateFrom || 'All'} to ${this.dateTo || 'All'} &mdash; Generated: ${new Date().toLocaleDateString()}</p>
<table>
<thead><tr>${headers.map(h => `<th ${thStyle}>${h}</th>`).join('')}</tr></thead>
<tbody>${dataRows.map(r => `<tr>${r.map(c => `<td ${tdStyle}>${this.escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
</table></body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => { win.print(); }, 500);
    }
  }

  private escapeXml(s: string): string {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  private escapeHtml(s: string): string {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
