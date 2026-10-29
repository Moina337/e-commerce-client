import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; 
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../shared/models/order.model'; 

import { PriceComponent } from '../../../shared/components/price/price.component'; // ADAPTER
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { formatOrderDate, ORDER_STATUS_LABELS } from '../../../shared/models/order-display';
@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, PriceComponent, AppButtonComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  private readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;
  readonly isAdmin = this.auth.isAdmin;

  readonly labels = ORDER_STATUS_LABELS;
  readonly formatDate = formatOrderDate;

  // Initiales pour l'avatar : « Awa Diop » donne « AD »
  readonly initials = computed(() => {
    const parts = (this.user()?.name ?? '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    const first = parts[0].charAt(0);
    const last = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? '') : '';
    return (first + last).toUpperCase();
  });

  readonly roleLabel = computed(() =>
    this.user()?.role === 'ADMIN' ? 'Administrateur' : 'Client',
  );

  // Dernières commandes (3 maximum)
  readonly orders = signal<Order[]>([]);
  readonly totalOrders = signal(0);
  readonly ordersLoading = signal(true);
  readonly ordersError = signal(false);

  constructor() {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersLoading.set(true);
    this.ordersError.set(false);

    this.orderService.loadMine(0, 3).subscribe({
      next: (result) => {
        this.orders.set(result.content);
        this.totalOrders.set(result.totalElements);
        this.ordersLoading.set(false);
      },
      error: () => {
        this.ordersError.set(true);
        this.ordersLoading.set(false);
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}