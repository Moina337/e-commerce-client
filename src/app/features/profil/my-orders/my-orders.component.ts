import { Component, OnInit, signal, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../core/services/order.service'; 
import { Order } from '../../../shared/models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe], // Plus besoin de CommonModule en Angular moderne !
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  // Déclaration des États avec les Signals
  orders = signal<Order[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadOrders(this.currentPage());
  }

  loadOrders(page: number): void {
    this.isLoading.set(true);
    // On charge 5 commandes par page pour l'exemple
    this.orderService.loadMine(page, 5).subscribe({
      next: (data) => {
        this.orders.set(data.content);
        this.currentPage.set(data.number);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur de chargement des commandes', err);
        this.isLoading.set(false);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.loadOrders(page);
    }
  }
}
