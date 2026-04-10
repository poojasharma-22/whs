import { Injectable } from '@angular/core';

export interface ParsedPO {
  vendorName: string;
  totalQty: number;
  poNumber: string;
  date: string;         // ISO string
  rawDate: string;      // PDF se jo date mili as-is
}

@Injectable({ providedIn: 'root' })
export class PdfParserService {

  // ── Alias Dictionary ────────────────────────────────────────────────────────
  private aliases = {
    vendorName: [
      'Vendor Name', 'Vendor', 'Supplier Name', 'Supplier',
      'Seller', 'Company', 'Bill From', 'Billed From',
      'Party Name', 'Firm Name', 'Business Name',
      'Organisation', 'Organization',
      'Issued By', 'Prepared By', 'Consignor',
      'Manufacturer', 'Distributor', 'Sold By',
      'Ship From', 'Merchant', 'Dealer', 'Trader', 'From',
    ],
    totalQty: [
      'Total Qty', 'Total Quantity', 'Total Units',
      'Total Items', 'Total Nos', 'Total Pcs',
      'Total Pieces', 'Total Count', 'Total No',
      'Order Quantity', 'Order Qty', 'Ordered Qty',
      'Ordered Quantity', 'Total Ordered',
      'No. of Items', 'No. of Units',
      'Quantity Total', 'Grand Qty', 'Net Qty',
      'Sum of Qty', 'Total Number',
      'Quantity',   // simple label
    ],
    poNumber: [
      'PO Number', 'PO No', 'PO#', 'P.O. No', 'P.O. Number',
      'Purchase Order No', 'Purchase Order Number',
      'Order No', 'Order Number', 'Order ID',
      'Reference No', 'Reference Number', 'Ref No',
      'Document No', 'Document Number', 'Doc No',
      'Transaction No', 'Invoice Ref', 'PO Ref',
    ],
    date: [
      'Create Date', 'Created Date', 'Date of Request',
      'Order Date', 'PO Date', 'Issue Date', 'Issued Date',
      'Request Date', 'Purchase Date', 'Transaction Date',
      'Document Date', 'Date of Issue', 'Date of Order',
      'Prepared Date', 'Date of Purchase', 'Invoice Date',
      'Booking Date', 'Generation Date', 'Dispatch Date',
      'Date',   // generic — last resort
    ],
  };

  // ── Load pdfjs dynamically ──────────────────────────────────────────────────
  loadPdfJs(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).pdfjsLib) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  // ── Extract full text from PDF file ────────────────────────────────────────
  async extractTextFromFile(file: File): Promise<string> {
    await this.loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdfjs = (window as any).pdfjsLib;
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    console.log('[PdfParser] Extracted text:', fullText); // debug
    return fullText;
  } 

  // ── Main parse function ─────────────────────────────────────────────────────
  async parsePO(file: File): Promise<ParsedPO> {
    const text = await this.extractTextFromFile(file);
    const rawDate = this.extractDate(text);

    return {
      vendorName: this.extractVendor(text),
      totalQty:   this.extractQty(text),
      poNumber:   this.extractPoNumber(text),
      rawDate:    rawDate || '',
      date:       this.parseToIso(rawDate) || new Date().toISOString(),
    };
  }

  // ── Vendor extraction ───────────────────────────────────────────────────────
  private extractVendor(text: string): string {
    // Strategy 1: Alias dictionary
    for (const alias of this.aliases.vendorName) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const patterns = [
        new RegExp(`${escaped}\\s*[:\\-]\\s*([^\\n\\r]+)`, 'i'),
        new RegExp(`${escaped}\\s{2,}([^\\n\\r]+)`, 'i'),
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          let value = match[1].trim();
          // Stop at 2+ spaces or known keywords
          value = value.split(/\s{2,}|\s+(?=Status|PO|Date|No\.|Invoice|Received|PDF|Ship)/i)[0].trim();
          // Remove leading "Vendor" word if alias leaked in
          value = value.replace(/^(?:Vendor|Supplier|Seller|Company)\s+/i, '').trim();
          if (value && value.length > 2) return value;
        }
      }
    }

    // Strategy 2: Company suffix — Inc, Ltd, Pvt, Corp, GmbH etc.
    const companyMatch = text.match(
      /([A-Z][A-Za-z\s\.,&'\-]+(?:Inc|Ltd|Pvt|Corp|LLC|LLP|GmbH|Co|Enterprises|Industries|Trading|Distribution|Solutions|Services)\.?)/
    );
    if (companyMatch) return companyMatch[1].trim();

    // Strategy 3: Proper noun after From/Issued By
    const fromMatch = text.match(/(?:From|Issued\s+By|Prepared\s+By)\s*[:\-]?\s*([A-Z][A-Za-z\s]+)/i);
    if (fromMatch) return fromMatch[1].trim();

    return '';
  }

  // ── Qty extraction ──────────────────────────────────────────────────────────
  private extractQty(text: string): number {

    // Strategy 1: Alias dictionary
    for (const alias of this.aliases.totalQty) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`${escaped}\\s*[:\\-]?\\s*([\\d,]+)`, 'im');
      const match = text.match(pattern);
      if (match) {
        const num = parseInt(match[1].replace(/,/g, ''));
        if (num > 0 && num < 1000000) return num;
      }
    }

    // Strategy 2: "X units / pieces / Nos / Pcs" pattern
    const unitPatterns = [
      /(\d[\d,]*)\s*units?/gi,
      /(\d[\d,]*)\s*pieces?/gi,
      /(\d[\d,]*)\s*Nos\.?/gi,
      /(\d[\d,]*)\s*Pcs\.?/gi,
    ];
    for (const pattern of unitPatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > 0) {
        const nums = matches
          .map(m => parseInt(m[1].replace(/,/g, '')))
          .filter(n => n > 0 && n < 1000000);
        if (nums.length > 0) return Math.max(...nums);
      }
    }

    // Strategy 3: QTY column sum (between QTY header and Sub-Total)
    const colMatch = text.match(
      /(?:QTY|Qty|Quantity|Nos\.?|Pcs\.?|Units?)\s*\n?([\s\S]*?)(?:Sub-?Total|Grand\s+Total|Total\s+Amt|Total\s+Amount)/i
    );
    if (colMatch) {
      const nums = [...colMatch[1].matchAll(/\b(\d{1,5})\b/g)]
        .map(m => parseInt(m[1]))
        .filter(n => n > 0 && n < 10000);
      if (nums.length > 0) return nums.reduce((a, b) => a + b, 0);
    }

    // Strategy 4: Table row sum
    const lines = text.split('\n');
    let inTable = false;
    const rowQtys: number[] = [];
    for (const line of lines) {
      if (/\b(QTY|Qty|Quantity|Nos|Pcs)\b/i.test(line)) {
        inTable = true;
        continue;
      }
      if (inTable) {
        if (/Sub-?Total|Grand\s+Total|Total\s+Amt/i.test(line)) break;
        const nums = [...line.matchAll(/\b(\d{1,4})\b/g)]
          .map(m => parseInt(m[1]))
          .filter(n => n > 0 && n < 10000);
        if (nums.length > 0) rowQtys.push(nums[0]);
      }
    }
    if (rowQtys.length > 0) return rowQtys.reduce((a, b) => a + b, 0);

    return 0;
  }

  // ── PO Number extraction ────────────────────────────────────────────────────
  private extractPoNumber(text: string): string {

    // Strategy 1: Alias dictionary — strict (must contain 3+ digits)
    for (const alias of this.aliases.poNumber) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const patterns = [
        new RegExp(`${escaped}\\s*[:\\-#]?\\s*([A-Z0-9][A-Z0-9\\-\\/]+)`, 'i'),
        new RegExp(`${escaped}\\s{1,3}([A-Z0-9][A-Z0-9\\-\\/]+)`, 'i'),
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          const value = match[1].trim();
          // Must have 3+ digits and be 4+ chars
          if (/\d{3,}/.test(value) && value.length >= 4) return value;
        }
      }
    }

    // Strategy 2: Common PO number patterns
    const poPatterns = [
      /\bPO[-\/]?\d{4}[-\/]?\d{2,6}\b/i,
      /\bP\.?O\.?\s*#\s*\d+\b/i,
      /\bORD[-\/]?\d{4,10}\b/i,
      /\b[A-Z]{2,4}[-\/]\d{4}[-\/]\d{2,6}\b/,
      /\bTXN\d{6,}\b/i,
      /\bREF[-\/][A-Z0-9\-]+\b/i,
      /\b[A-Z]{3}[-\/]\d{4}[-\/]\d{3,6}\b/,
    ];
    for (const pattern of poPatterns) {
      const match = text.match(pattern);
      if (match) return match[0].trim();
    }

    return '';
  }

  // ── Date extraction ─────────────────────────────────────────────────────────
  private extractDate(text: string): string | null {
    const dateRegexes = [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/i,
      /(\w+\s+\d{1,2},?\s+\d{4})/,
      /(\d{4}[\/\-]\d{2}[\/\-]\d{2})/,
    ];

    // Strategy 1: Alias dictionary
    for (const alias of this.aliases.date) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = text.match(new RegExp(`${escaped}\\s*[:\\-]?\\s*([^\\n\\r]+)`, 'i'));
      if (match) {
        const value = match[1].trim();
        for (const dp of dateRegexes) {
          const dm = value.match(dp);
          if (dm) return dm[1];
        }
      }
    }

    // Strategy 2: Any date in text
    for (const dp of dateRegexes) {
      const match = text.match(dp);
      if (match) return match[1];
    }

    return null;
  }

  // ── Convert raw date string to ISO ─────────────────────────────────────────
  private parseToIso(rawDate: string | null): string | null {
    if (!rawDate) return null;
    try {
      // DD/MM/YYYY
      const dmy = rawDate.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
      if (dmy) {
        const year = dmy[3].length === 2 ? '20' + dmy[3] : dmy[3];
        return new Date(`${year}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`).toISOString();
      }
      // Any parseable format
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) return d.toISOString();
    } catch {}
    return null;
  }
}