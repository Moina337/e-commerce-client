import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminOrder, OrderStatus } from '../../shared/models/order.model';

export interface AdminOrderPage {
  content: AdminOrder[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/admin/orders`;

  loadPage(page = 0, size = 20): Observable<AdminOrderPage> {
    return this.http.get<AdminOrderPage>(this.url, { params: { page, size } });
  }

  getById(id: number): Observable<AdminOrder> {
    return this.http.get<AdminOrder>(`${this.url}/${id}`);
  }

  // PATCH sans corps : le nouveau statut part dans l'URL (?status=SHIPPED)
  updateStatus(id: number, status: OrderStatus): Observable<AdminOrder> {
    return this.http.patch<AdminOrder>(`${this.url}/${id}/status`, null, {
      params: { status },
    });
  }
}