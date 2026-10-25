import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShopProductService } from '../../../../../core/services/shop-product.service'; 
import { PriceComponent } from '../../../../../shared/components/price/price.component'; 

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink, PriceComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent {
  private readonly service = inject(ShopProductService);

  // ADAPTER : mets 'images/hero.jpg' quand ta photo est dans public/images/
  readonly heroImage: string | null = 'images/hero.jpg' ;

  // Le premier produit renvoyé par l'API (ordre défini par ton backend)
  readonly product = computed(() => this.service.featured()[0] ?? null);

  // Photo choisie, sinon image du produit, sinon rien (la colonne disparaît)
  readonly image = computed(
    () => this.heroImage ?? this.product()?.images[0]?.url ?? null,
  );

  readonly imageAlt = computed(() =>
    this.heroImage ? 'Chaussures de la collection' : (this.product()?.name ?? ''),
  );

  constructor() {
    this.service.loadFeatured();
  }
}