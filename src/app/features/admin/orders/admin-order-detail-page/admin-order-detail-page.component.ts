import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AdminOrderService } from '../../../../core/services/admin-order.service'; // ADAPTER
import { AdminOrder, OrderStatus } from '../../../../shared/models/order.model'; // ADAPTER
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  formatOrderDate,
} from '../../../../shared/models/order-display'; // ADAPTER
import { PriceComponent } from '../../../../shared/components/price/price.component'; // ADAPTER

type PageState = 'loading' | 'ready' | 'not-found' | 'error';

@Component({
  selector: 'app-admin-order-detail-page',
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatSelectModule, PriceComponent],
  templateUrl: './admin-order-detail-page.component.html',
  styleUrl: './admin-order-detail-page.component.css',
})
export class AdminOrderDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(AdminOrderService);

  readonly labels = ORDER_STATUS_LABELS;
  readonly statuses = ORDER_STATUSES;
  readonly formatDate = formatOrderDate;

  readonly state = signal<PageState>('loading');
  readonly order = signal<AdminOrder | null>(null);

  // Le statut choisi dans la liste, pas encore enregistré
  readonly selectedStatus = signal<OrderStatus>('PENDING');
  readonly saving = signal(false);
  readonly confirmingCancel = signal(false);
  readonly saved = signal(false);
  readonly saveError = signal<string | null>(null);

  // Le bouton n'est actif que si le choix diffère du statut actuel
  readonly changed = computed(() => {
    const current = this.order();
    return !!current && current.status !== this.selectedStatus();
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.state.set('not-found');
      return;
    }

    this.service.getById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.selectedStatus.set(order.status);
        this.state.set('ready');
      },
      error: (err: HttpErrorResponse) =>
        this.state.set(err.status === 404 ? 'not-found' : 'error'),
    });
  }

  onStatusChange(event: MatSelectChange): void {
    this.selectedStatus.set(event.value);
    this.saved.set(false);
    this.saveError.set(null);
    this.confirmingCancel.set(false);
  }

  save(): void {
    const current = this.order();
    if (!current || !this.changed() || this.saving()) {
      return;
    }

    // Annuler est destructif : on demande d'abord une confirmation
    if (this.selectedStatus() === 'CANCELLED' && !this.confirmingCancel()) {
      this.confirmingCancel.set(true);
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    this.service.updateStatus(current.id, this.selectedStatus()).subscribe({
      next: (updated) => {
        // On affiche la commande telle que le serveur la renvoie
        this.order.set(updated);
        this.selectedStatus.set(updated.status);
        this.saving.set(false);
        this.confirmingCancel.set(false);
        this.saved.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.confirmingCancel.set(false);
        this.selectedStatus.set(current.status); // on revient au statut réel
        this.saveError.set(
          typeof err.error?.message === 'string'
            ? err.error.message
            : 'Le changement de statut a été refusé.',
        );
      },
    });
  }
}