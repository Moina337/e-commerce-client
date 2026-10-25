import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment'; 
import { ShopProduct } from '../../shared/models/shop-product.model'; 
import { map } from 'rxjs';

// Forme de la réponse paginée de Spring (on n'utilise que content)
interface ProductPage {
  content: ShopProduct[];
}
export interface ShopCategory {
  id: number;
  name: string;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class ShopProductService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/api`;

  readonly products = signal<ShopProduct[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly featured = signal<ShopProduct[]>([]);
readonly featuredLoading = signal(false);
readonly featuredError = signal(false);

readonly categoryList = signal<ShopCategory[]>([]);
readonly categoryListLoading = signal(false);

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    // size=100 : on charge beaucoup de produits, la page filtre côté front
    this.http
      .get<ProductPage>(`${this.api}/products`, { params: { page: 0, size: 100 } })
      .subscribe({
        next: (result) => {
          this.products.set(result.content.map((p) => this.withFullImageUrls(p)));
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Impossible de charger les produits.');
          this.loading.set(false);
        },
      });
  }

  // Retourne un Observable : c'est la page qui s'y abonne
getBySlug(slug: string) {
  return this.http
    .get<ShopProduct>(`${this.api}/products/${encodeURIComponent(slug)}`)
    .pipe(map((product) => this.withFullImageUrls(product)));
}

// Charge les 8 premiers produits pour l'accueil (une seule fois)
loadFeatured(size = 8): void {
  if (this.featured().length > 0 || this.featuredLoading()) {
    return;
  }

  this.featuredLoading.set(true);
  this.featuredError.set(false);

  this.http
    .get<ProductPage>(`${this.api}/products`, { params: { page: 0, size } })
    .subscribe({
      next: (result) => {
        this.featured.set(result.content.map((p) => this.withFullImageUrls(p)));
        this.featuredLoading.set(false);
      },
      error: () => {
        this.featuredError.set(true);
        this.featuredLoading.set(false);
      },
    });
}

// Charge les catégories une seule fois (GET /api/categories renvoie un tableau simple)
loadCategories(): void {
  if (this.categoryList().length > 0 || this.categoryListLoading()) {
    return;
  }

  this.categoryListLoading.set(true);

  this.http.get<ShopCategory[]>(`${this.api}/categories`).subscribe({
    next: (list) => {
      this.categoryList.set(list);
      this.categoryListLoading.set(false);
    },
    // Échec silencieux : la section disparaît (voir le composant)
    error: () => this.categoryListLoading.set(false),
  });
}

  // Si l'API renvoie une URL relative (/api/images/12/content), on la complète.
  // Si elle est déjà absolue, rien ne change.
  private withFullImageUrls(product: ShopProduct): ShopProduct {
    return {
      ...product,
      images: product.images.map((img) => ({
        ...img,
        url: img.url.startsWith('http') ? img.url : `${environment.apiUrl}${img.url}`,
      })),
    };
  }
}