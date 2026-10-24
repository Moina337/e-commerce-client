import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ShopProductService } from '../../../../core/services/shop-product.service';
import { ShopProduct } from '../../../../shared/models/shop-product.model';
import { PriceComponent } from '../../../../shared/components/price/price.component';
import { AddToCartComponent } from '../../../../shared/components/app-add-to-cart/add-to-cart.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

type DetailState =
  | { status: 'loading' }
  | { status: 'ready'; product: ShopProduct }
  | { status: 'not-found' }
  | { status: 'error' };

@Component({
  selector: 'app-product-page',
  imports: [RouterLink, PriceComponent, AddToCartComponent, ProductCardComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ShopProductService);

  private readonly paramMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly slug = computed(() => this.paramMap().get('slug') ?? '');

  // À chaque changement de slug : nouvelle requête, l'ancienne est annulée
  private readonly state = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) =>
        slug
          ? this.service.getBySlug(slug).pipe(
              map((product): DetailState => ({ status: 'ready', product })),
              catchError((err) =>
                of<DetailState>({ status: err.status === 404 ? 'not-found' : 'error' }),
              ),
              startWith<DetailState>({ status: 'loading' }),
            )
          : of<DetailState>({ status: 'not-found' }),
      ),
    ),
    { initialValue: { status: 'loading' } as DetailState },
  );

  readonly status = computed(() => this.state().status);

  readonly product = computed<ShopProduct | null>(() => {
    const s = this.state();
    return s.status === 'ready' ? s.product : null;
  });

  // Produits de la même catégorie (4 maximum, sans le produit affiché)
  readonly related = computed<ShopProduct[]>(() => {
    const current = this.product();
    if (!current?.category) {
      return [];
    }
    return this.service
      .products()
      .filter((p) => p.id !== current.id && p.category?.id === current.category.id)
      .slice(0, 4);
  });

  readonly selectedImage = signal<string | null>(null);

  readonly placeholderImage = 'images/product-placeholder.png'; // ADAPTER : fichier dans public/images/

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

  constructor() {
    // Les produits similaires lisent la liste : on la charge si elle est vide (F5 direct sur la fiche)
    if (this.service.products().length === 0) {
      this.service.loadProducts();
    }
  }

  selectImage(url: string): void {
    this.selectedImage.set(url);
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    const placeholderUrl = new URL(this.placeholderImage, document.baseURI).href;

    if (image.src !== placeholderUrl) {
      image.src = this.placeholderImage;
    }
  }
}