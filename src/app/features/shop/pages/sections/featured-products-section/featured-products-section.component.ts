import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShopProductService } from '../../../../../core/services/shop-product.service'; 
import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-featured-products-section',
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './featured-products-section.component.html',
  styleUrl: './featured-products-section.component.css',
})
export class FeaturedProductsSectionComponent {
  private readonly service = inject(ShopProductService);

  readonly products = this.service.featured;
  readonly loading = this.service.featuredLoading;
  readonly error = this.service.featuredError;

  // Pour afficher des cartes vides pendant le chargement
  readonly placeholders = [1, 2, 3, 4];

  constructor() {
    this.service.loadFeatured();
  }
}