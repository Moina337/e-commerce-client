import { Component, computed, signal } from '@angular/core';
import { mockProducts } from '../../../../mocks/product_mock';
import { Product } from '../../../../shared/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  readonly products = mockProducts;
  readonly cartItems = signal<Product[]>([]);
  readonly cartCount = computed(() => this.cartItems().length);

  addToCart(product: Product): void {
    this.cartItems.update((items) => [...items, product]);
  }
}
