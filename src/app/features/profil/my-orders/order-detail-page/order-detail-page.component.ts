import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../shared/models/order.model';
import { ORDER_STATUS_LABELS, formatOrderDate } from '../../../../shared/models/order-display';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component';

type DetailState =
  | { status: 'loading' }
  | { status: 'ready'; order: Order }
  | { status: 'not-found' }
  | { status: 'error' };

@Component({
  selector: 'app-order-detail-page',
  imports: [RouterLink, PriceComponent, AppButtonComponent],
  templateUrl: './order-detail-page.component.html',
  styleUrl: './order-detail-page.component.css',
})
export class OrderDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(OrderService);

  readonly labels = ORDER_STATUS_LABELS;
  readonly formatDate = formatOrderDate;

  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  // NaN si l'URL n'est pas un nombre : traité comme « introuvable »
  private readonly id = computed(() => Number(this.paramMap().get('id')));

  private readonly state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        Number.isInteger(id)
          ? this.service.getById(id).pipe(
              map((order): DetailState => ({ status: 'ready', order })),
              catchError((err: HttpErrorResponse) =>
                of<DetailState>({
                  // 403 ou 404 : commande inexistante ou appartenant à un autre client
                  status: err.status === 404 || err.status === 403 ? 'not-found' : 'error',
                }),
              ),
              startWith<DetailState>({ status: 'loading' }),
            )
          : of<DetailState>({ status: 'not-found' }),
      ),
    ),
    { initialValue: { status: 'loading' } as DetailState },
  );

  readonly status = computed(() => this.state().status);

  readonly order = computed<Order | null>(() => {
    const s = this.state();
    return s.status === 'ready' ? s.order : null;
  });

  // Annulation proposée seulement en attente (le serveur a le dernier mot)
  readonly canCancel = computed(() => this.order()?.status === 'PENDING');

  readonly confirming = signal(false);
  readonly cancelling = signal(false);
  readonly cancelError = signal<string | null>(null);

  askCancel(): void {
    this.confirming.set(true);
    this.cancelError.set(null);
  }

  keepOrder(): void {
    this.confirming.set(false);
  }

  confirmCancel(): void {
    const order = this.order();
    if (!order || this.cancelling()) {
      return;
    }

    this.cancelling.set(true);
    this.cancelError.set(null);

    this.service.cancel(order.id).subscribe({
      // On retourne à la liste : elle montre l'état réel de la commande
     next: () => this.router.navigate(['/profil/orders']),
      error: (err: HttpErrorResponse) => {
        this.cancelling.set(false);
        this.confirming.set(false);
        this.cancelError.set(
          typeof err.error?.message === 'string'
            ? err.error.message
            : "L'annulation n'a pas pu être effectuée.",
        );
      },
    });
  }
}