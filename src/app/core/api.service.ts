import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, from, map, of, shareReplay, tap } from 'rxjs';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private fallbackDb$: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  private loadFallbackDb(): Observable<any> {
    if (!this.fallbackDb$) {
      this.fallbackDb$ = from(fetch('/db.json').then((r) => r.json())).pipe(
        shareReplay(1)
      );
    }
    return this.fallbackDb$;
  }

  private fallbackGet<T>(key: string, project?: (db: any) => T): Observable<T> {
    return this.loadFallbackDb().pipe(
      map((db) => (project ? project(db) : db[key]))
    );
  }



  // ── Purchase Orders  add kiya hai──────────────────────────────────────────
 
  getPurchaseOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/purchaseOrders`).pipe(
      catchError(() => this.fallbackGet<any[]>('purchaseOrders'))
    );
  }
 
  getPurchaseOrder(id: number): Observable<any> {
    return this.http.get<any>(`${API}/purchaseOrders/${id}`).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('purchaseOrders').pipe(
          map((list) => list.find((po: any) => po.id === id) || null)
        )
      )
    );
  }
 
  addPurchaseOrder(po: any): Observable<any> {
    return this.http.post<any>(`${API}/purchaseOrders`, po);
  }
 
  updatePurchaseOrder(id: number, po: any): Observable<any> {
    return this.http.patch<any>(`${API}/purchaseOrders/${id}`, po);
  }
 
  // ── PO Invoices ──────────────────────────────────────────────
  // (poId se filter hoti hain — ek PO ke multiple invoices)
 
  getPoInvoices(poId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API}/poInvoices?poId=${poId}`).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('poInvoices').pipe(
          map((list) => list.filter((inv: any) => inv.poId === poId))
        )
      )
    );
  }
 
  addPoInvoice(invoice: any): Observable<any> {
    return this.http.post<any>(`${API}/poInvoices`, invoice);
  }
 
  updatePoInvoice(id: number, invoice: any): Observable<any> {
    return this.http.patch<any>(`${API}/poInvoices/${id}`, invoice);
  }




  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/invoices`).pipe(
      catchError(() => this.fallbackGet<any[]>('invoices'))
    );
  }
  addInvoice(invoice: any): Observable<any> {
    return this.http.post<any>(`${API}/invoices`, invoice);
  }

  getProducts(invoiceId?: number): Observable<any[]> {
    const url = invoiceId ? `${API}/products?invoiceId=${invoiceId}` : `${API}/products`;
    return this.http.get<any[]>(url).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('products').pipe(
          map((list) => (invoiceId ? list.filter((p: any) => p.invoiceId === invoiceId) : list))
        )
      )
    );
  }
  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${API}/products/${id}`).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('products').pipe(
          map((list) => list.find((p: any) => p.id === id) || null)
        )
      )
    );
  }
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${API}/products`, product);
  }
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.patch<any>(`${API}/products/${id}`, product);
  }
  bulkAddProducts(products: any[]): Observable<any> {
    return this.http.post<any>(`${API}/products`, products);
  }

  getOutlets(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/outlets`).pipe(
      catchError(() => this.fallbackGet<any[]>('outlets'))
    );
  }
  getOutlet(id: number): Observable<any> {
    return this.http.get<any>(`${API}/outlets/${id}`).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('outlets').pipe(
          map((list) => list.find((o: any) => o.id === id) || null)
        )
      )
    );
  }
  addOutlet(outlet: any): Observable<any> {
    return this.http.post<any>(`${API}/outlets`, outlet);
  }
  updateOutlet(id: number, outlet: any): Observable<any> {
    return this.http.patch<any>(`${API}/outlets/${id}`, outlet);
  }

  getParcels(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/parcels`).pipe(
      catchError(() => this.fallbackGet<any[]>('parcels'))
    );
  }
  getParcel(id: number): Observable<any> {
    return this.http.get<any>(`${API}/parcels/${id}`).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('parcels').pipe(
          map((list) => list.find((p: any) => p.id === id) || null)
        )
      )
    );
  }
  addParcel(parcel: any): Observable<any> {
    return this.http.post<any>(`${API}/parcels`, parcel);
  }
  updateParcel(id: number, parcel: any): Observable<any> {
    return this.http.patch<any>(`${API}/parcels/${id}`, parcel);
  }

  getDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/drivers`).pipe(
      catchError(() => this.fallbackGet<any[]>('drivers'))
    );
  }
  getDriver(id: number): Observable<any> {
    return this.http.get<any>(`${API}/drivers/${id}`).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('drivers').pipe(
          map((list) => list.find((d: any) => d.id === id) || null)
        )
      )
    );
  }
  addDriver(driver: any): Observable<any> {
    return this.http.post<any>(`${API}/drivers`, driver);
  }
  updateDriver(id: number, driver: any): Observable<any> {
    return this.http.patch<any>(`${API}/drivers/${id}`, driver);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/users`).pipe(
      catchError(() => this.fallbackGet<any[]>('users'))
    );
  }
  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${API}/users/${id}`).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('users').pipe(
          map((list) => list.find((u: any) => u.id === id) || null)
        )
      )
    );
  }
  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${API}/users`, user);
  }
  updateUser(id: number, user: any): Observable<any> {
    return this.http.patch<any>(`${API}/users/${id}`, user);
  }

  getPickers(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/pickers`).pipe(
      catchError(() => this.fallbackGet<any[]>('pickers'))
    );
  }
  getPicker(id: number): Observable<any> {
    return this.http.get<any>(`${API}/pickers/${id}`).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('pickers').pipe(
          map((list) => list.find((p: any) => p.id === id) || null)
        )
      )
    );
  }
  addPicker(picker: any): Observable<any> {
    return this.http.post<any>(`${API}/pickers`, picker);
  }
  updatePicker(id: number, picker: any): Observable<any> {
    return this.http.patch<any>(`${API}/pickers/${id}`, picker);
  }

  getDispatchManagers(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/dispatchManagers`).pipe(
      catchError(() => this.fallbackGet<any[]>('dispatchManagers'))
    );
  }
  getDispatchManager(id: number): Observable<any> {
    return this.http.get<any>(`${API}/dispatchManagers/${id}`).pipe(
      catchError(() =>
        this.fallbackGet<any[]>('dispatchManagers').pipe(
          map((list) => list.find((d: any) => d.id === id) || null)
        )
      )
    );
  }
  addDispatchManager(manager: any): Observable<any> {
    return this.http.post<any>(`${API}/dispatchManagers`, manager);
  }
  updateDispatchManager(id: number, manager: any): Observable<any> {
    return this.http.patch<any>(`${API}/dispatchManagers/${id}`, manager);
  }

  getDeviations(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/deviations`).pipe(
      catchError(() => this.fallbackGet<any[]>('deviations'))
    );
  }
  markDeviationRead(id: number): Observable<any> {
    return this.http.patch<any>(`${API}/deviations/${id}`, { read: true });
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/notifications`).pipe(
      catchError(() => this.fallbackGet<any[]>('notifications'))
    );
  }
  markNotificationRead(id: number): Observable<any> {
    return this.http.patch<any>(`${API}/notifications/${id}`, { read: true });
  }

  getTransfers(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/transfers`).pipe(
      catchError(() => this.fallbackGet<any[]>('transfers'))
    );
  }
  addTransfer(transfer: any): Observable<any> {
    return this.http.post<any>(`${API}/transfers`, transfer);
  }
  updateTransfer(id: number, transfer: any): Observable<any> {
    return this.http.patch<any>(`${API}/transfers/${id}`, transfer);
  }
}
