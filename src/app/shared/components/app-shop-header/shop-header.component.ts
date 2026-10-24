import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service'; 
import { CartDrawerService } from '../../../core/services/cart-drawer.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-shop-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './shop-header.component.html',
  styleUrl: './shop-header.component.css',
})
export class ShopHeaderComponent {
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  readonly drawer = inject(CartDrawerService);

  readonly count = this.cart.count;
  readonly currentUser = this.auth.currentUser;
  readonly isAdmin = this.auth.isAdmin;
  readonly menuOpen = signal(false);

  constructor() {
    if (this.auth.accessToken() && !this.currentUser()) {
      this.auth.getCurrentUser().subscribe({
        error: () => undefined,
      });
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
  }
}
