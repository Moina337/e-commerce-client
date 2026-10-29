import { Component, computed, signal } from '@angular/core';
import { mockProducts } from '../../../../mocks/product_mock';
import { Product } from '../../../../shared/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { HeroSectionComponent } from '../sections/hero-section/hero-section.component';
import { FeaturedProductsSectionComponent } from '../sections/featured-products-section/featured-products-section.component';
import { CategoriesSectionComponent } from '../sections/categories-section/categories-section.component';
import { FinalBannerSectionComponent } from '../sections/final-banner-section/final-banner-section.component';

@Component({
  imports: [ HeroSectionComponent,CategoriesSectionComponent, 
    FeaturedProductsSectionComponent,FinalBannerSectionComponent],
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
