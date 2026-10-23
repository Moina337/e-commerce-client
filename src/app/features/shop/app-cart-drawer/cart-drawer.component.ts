import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service'; 
import { CartDrawerService } from '../../../core/services/cart-drawer.service';  // ADAPTER
import { PriceComponent } from '../../../shared/components/price/price.component';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component'; 

@Component({
  selector: 'app-cart-drawer',
  imports: [PriceComponent, AppButtonComponent],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css',
  host: { '(document:keydown.escape)': 'drawer.close()' },
})
export class CartDrawerComponent {
  readonly cart = inject(CartService);
  readonly drawer = inject(CartDrawerService);
  private readonly router = inject(Router);

  constructor() {
    // Bloque le défilement de la page derrière quand le panneau est ouvert
    effect(() => {
      document.body.style.overflow = this.drawer.isOpen() ? 'hidden' : '';
    });
  }

  goToCart(): void {
    this.drawer.close();
    this.router.navigate(['/shop/cart']); // ADAPTER : ta vraie route
  }
}