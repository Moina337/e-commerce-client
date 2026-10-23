import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service'; 
import { PriceComponent } from '../../../../shared/components/price/price.component'; // ADAPTER
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component'; // ADAPTER

@Component({
  imports: [RouterLink, PriceComponent, AppButtonComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent {
  readonly cart = inject(CartService);
}