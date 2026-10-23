import { Component, inject, input } from '@angular/core';
import { ShopProduct } from '../../models/shop-product.model';
import { CartService } from '../../../core/services/cart.service'; 
import { AppButtonComponent } from '../app-button/app-button.component';

@Component({
  selector: 'app-add-to-cart',
  imports: [AppButtonComponent],
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.css',
})
export class AddToCartComponent {
  private readonly cart = inject(CartService);

  readonly product = input.required<ShopProduct>();

  add(): void {
    this.cart.add(this.product());
  }
}