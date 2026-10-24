import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { mockProducts } from '../../../../mocks/product_mock';
import { ShopProduct } from '../../../../shared/models/shop-product.model';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { AddToCartComponent } from '../../../../shared/components/app-add-to-cart/add-to-cart.component';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [RouterLink, PriceComponent, AddToCartComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent {
  private readonly route = inject(ActivatedRoute);

  // Signal dérivé du paramMap de la route
  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  // Computed pour extraire le slug réactif depuis le signal du paramètre de route
  readonly slug = computed(() => this.paramMap().get('slug') ?? '');

  // Computed pour trouver le produit correspondant dans les mocks
  readonly product = computed<ShopProduct | null>(() => {
    const currentSlug = this.slug();
    if (!currentSlug) {
      return null;
    }
    const found = (mockProducts as ShopProduct[]).find((p) => p.slug === currentSlug);
    return found ?? null;
  });

  // Signal pour l'image sélectionnée
  readonly selectedImage = signal<string | null>(null);

  readonly placeholderImage = 'assets/images/product-placeholder.png';

  // Image couramment affichée : sélectionnée ou première image par défaut
  readonly currentImage = computed<string>(() => {
    const prod = this.product();
    if (!prod || !prod.images || prod.images.length === 0) {
      return this.placeholderImage;
    }
    const selected = this.selectedImage();
    if (selected && prod.images.some((img) => img.url === selected)) {
      return selected;
    }
    return prod.images[0]?.url || this.placeholderImage;
  });

  selectImage(url: string): void {
    this.selectedImage.set(url);
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
}
