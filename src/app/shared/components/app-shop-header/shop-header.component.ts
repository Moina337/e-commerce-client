import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service'; 
import { CartDrawerService } from '../../../core/services/cart-drawer.service';

@Component({
  selector: 'app-shop-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './shop-header.component.html',
  styleUrl: './shop-header.component.css',
})
export class ShopHeaderComponent {
  private readonly cart = inject(CartService);

  readonly count = this.cart.count;
  readonly menuOpen = signal(false);
  readonly drawer = inject(CartDrawerService);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}