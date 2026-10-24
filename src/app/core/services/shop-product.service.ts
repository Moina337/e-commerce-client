import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment'; 
import { ShopProduct } from '../../shared/models/shop-product.model'; 
import { map } from 'rxjs';

// Forme de la réponse paginée de Spring (on n'utilise que content)
interface ProductPage {
  content: ShopProduct[];
}

@Injectable({ providedIn: 'root' })
export class ShopProductService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/api`;

  readonly products = signal<ShopProduct[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

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