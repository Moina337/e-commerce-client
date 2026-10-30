import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AdminOrderService } from '../../../../core/services/admin-order.service'; // ADAPTER
import { AdminOrder } from '../../../../shared/models/order.model'; // ADAPTER
import { ORDER_STATUS_LABELS, formatOrderDate } from '../../../../shared/models/order-display'; // ADAPTER
import { PriceComponent } from '../../../../shared/components/price/price.component'; // ADAPTER
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-orders-page',
    imports: [CommonModule, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, PriceComponent],
    templateUrl: './admin-orders-page.component.html',
    styleUrl: './admin-orders-page.component.css',
})
export class AdminOrdersPageComponent {
    private readonly service = inject(AdminOrderService);

    readonly labels: any = ORDER_STATUS_LABELS;
    readonly formatDate = formatOrderDate;
    readonly displayedColumns = ['id', 'client', 'date', 'status', 'total', 'actions'];

    readonly orders = signal<AdminOrder[]>([]);
    readonly total = signal(0);
    readonly pageIndex = signal(0);
    readonly pageSize = signal(20);
    readonly loading = signal(true);
    readonly error = signal(false);

    constructor() {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.error.set(false);

        this.service.loadPage(this.pageIndex(), this.pageSize()).subscribe({
            next: (result) => {
                this.orders.set(result.content);
                this.total.set(result.totalElements);
                this.loading.set(false);
            },
            error: () => {
                this.error.set(true);
                this.loading.set(false);
            },
        });
    }

    // Chaque changement de page est un nouvel appel HTTP (pagination serveur)
    onPage(event: PageEvent): void {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.load();
    }
}