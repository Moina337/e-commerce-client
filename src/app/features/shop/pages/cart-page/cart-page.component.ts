import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service'; 
import { AuthService } from '../../../../core/services/auth.service'; // ADAPTER
import { OrderService } from '../../../../core/services/order.service'; // ADAPTER
import { Order } from '../../../../shared/models/order.model'; // ADAPTER
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component';

@Component({
  imports: [RouterLink, PriceComponent, AppButtonComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent {
  readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly orders = inject(OrderService);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly confirmedOrder = signal<Order | null>(null);

  checkout(): void {
    // Évite le double clic et la commande vide
    if (this.saving() || this.cart.items().length === 0) {
      return;
    }

    // Pas connecté : connexion d'abord, puis retour sur cette page
    if (!this.auth.accessToken()) {
      this.goToLogin();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    // Le serveur ne veut que l'id et la quantité (il calcule les prix lui-même)
    const items = this.cart.items().map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    this.orders.create(items).subscribe({
      next: (order) => {
        this.cart.clear(); // seulement APRÈS la réponse du serveur
        this.confirmedOrder.set(order);
        this.saving.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);

        // Session expirée ou refusée : on repart vers la connexion
        if (err.status === 401 || err.status === 403) {
          this.auth.logout();
          this.goToLogin();
          return;
        }

        const serverMessage =
          typeof err.error?.message === 'string' ? err.error.message : null;
        this.error.set(
          serverMessage ?? "La commande n'a pas pu être enregistrée. Réessayez.",
        );
      },
    });
  }

  private goToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url },
    });
  }
}