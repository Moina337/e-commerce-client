import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../shared/models/order.model';
import { ORDER_STATUS_LABELS, formatOrderDate } from '../../../../shared/models/order-display';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-orders-page',
  imports: [RouterLink, PriceComponent, AppButtonComponent],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css',
})
export class OrdersPageComponent {
  private readonly service = inject(OrderService);

  readonly labels = ORDER_STATUS_LABELS;
  readonly formatDate = formatOrderDate;

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly pageIndex = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);

  private readonly size = 10;

  constructor() {
    this.load(0);
  }

  load(page: number): void {
    this.loading.set(true);
    this.error.set(false);

    this.service.loadMine(page, this.size).subscribe({
      next: (result) => {
        this.orders.set(result.content);
        this.pageIndex.set(result.number);
        this.totalPages.set(result.totalPages);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // Chaque changement de page est un nouvel appel HTTP (pagination serveur)
  goToPage(index: number): void {
    if (index >= 0 && index < this.totalPages() && !this.loading()) {
      this.load(index);
    }
  }

  itemCount(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}