
import {
  CurrencyPipe,
  registerLocaleData,
} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, input, output } from '@angular/core';
import { ShopProduct } from '../../models/shop-product.model';
import { PriceComponent } from '../price/price.component';
import { AddToCartComponent } from '../app-add-to-cart/add-to-cart.component';

registerLocaleData(localeFr);

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [PriceComponent, AddToCartComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  readonly product = input.required<ShopProduct>();
  readonly addToCart = output<ShopProduct>();

  readonly placeholderImage = 'assets/images/product-placeholder.png';

  get productImage(): string {
    return this.product().images?.[0]?.url || this.placeholderImage;
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    const placeholderUrl = new URL(
      this.placeholderImage,
      document.baseURI,
    ).href;

    if (image.src !== placeholderUrl) {
      image.src = this.placeholderImage;
    }
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product());
  }
}
