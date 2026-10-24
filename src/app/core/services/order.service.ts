import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderItemRequest } from '../../shared/models/order.model';

// Enveloppe de pagination de Spring (on n'utilise que ces champs)
export interface OrderPage {
  content: Order[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/orders`;

  // POST : envoie le panier, retourne la commande créée par le serveur
  create(items: OrderItemRequest[]): Observable<Order> {
    return this.http.post<Order>(this.url, { items });
  }

  // Les trois suivantes serviront à la page « Mes commandes »
  loadMine(page = 0, size = 10): Observable<OrderPage> {
    return this.http.get<OrderPage>(this.url, { params: { page, size } });
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  cancel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}