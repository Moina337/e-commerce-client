import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopProductService } from '../../../../core/services/shop-product.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component';

type ProductSortOrder = 'default' | 'name' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-shop-page',
  imports: [ProductCardComponent, AppButtonComponent],
  templateUrl: './shop-page.component.html',
  styleUrl: './shop-page.component.css',
})
export class ShopPageComponent {
  private readonly service = inject(ShopProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly products = this.service.products;
  readonly loading = this.service.loading;
  readonly error = this.service.error;

  readonly pageSize = 4;
  readonly searchTerm = signal('');
  readonly sortOrder = signal<ProductSortOrder>('default');
  readonly pageIndex = signal(0);

  // Les paramètres d'URL sous forme de signal
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  // Slug de la catégorie choisie (null = toutes). Déclaré avant filteredProducts.
  readonly selectedCategorySlug = computed(() => this.queryParams().get('category'));

  constructor() {
    this.service.loadProducts();
  }

  // Catégories déduites des produits chargés (sans doublon)
  readonly categories = computed(() => {
    const unique = new Map(
      this.products()
        .filter((product) => product.category != null)
        .map((product) => [product.category.slug, product.category]),
    );
    return [...unique.values()];
  });

  readonly filteredProducts = computed(() => {
    const search = this.searchTerm().trim().toLocaleLowerCase('fr');
    const slug = this.selectedCategorySlug();

    // filter crée une copie : on peut la trier sans toucher aux données du service
    const result = this.products().filter((product) => {
      const searchableText =
        `${product.name ?? ''} ${product.description ?? ''} ${product.category?.name ?? ''}`
          .toLocaleLowerCase('fr');

      const matchesSearch = search.length === 0 || searchableText.includes(search);
      const matchesCategory = slug === null || product.category?.slug === slug;

      return matchesSearch && matchesCategory;
    });

    switch (this.sortOrder()) {
      case 'name':
        return result.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      default:
        return result;
    }
  });

  readonly pageCount = computed(() =>
    Math.ceil(this.filteredProducts().length / this.pageSize),
  );

  // Protège contre une page qui n'existe plus après un nouveau filtre
  readonly safePageIndex = computed(() =>
    Math.min(this.pageIndex(), Math.max(0, this.pageCount() - 1)),
  );

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index),
  );

  readonly paginatedProducts = computed(() => {
    const start = this.safePageIndex() * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  readonly firstVisibleProduct = computed(() =>
    this.filteredProducts().length === 0 ? 0 : this.safePageIndex() * this.pageSize + 1,
  );

  readonly lastVisibleProduct = computed(() =>
    Math.min((this.safePageIndex() + 1) * this.pageSize, this.filteredProducts().length),
  );

  onSearchInput(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    this.searchTerm.set(event.target.value);
    this.pageIndex.set(0);
  }

  onCategoryChange(event: Event): void {
    if (!(event.target instanceof HTMLSelectElement)) {
      return;
    }

    const value = event.target.value;

    // On écrit dans l'URL : selectedCategorySlug se met à jour tout seul
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: value === '' ? null : value },
      queryParamsHandling: 'merge',
    });

    this.pageIndex.set(0);
  }

  onSortChange(event: Event): void {
    if (!(event.target instanceof HTMLSelectElement)) {
      return;
    }
    this.sortOrder.set(event.target.value as ProductSortOrder);
    this.pageIndex.set(0);
  }

  goToPage(index: number): void {
    if (index >= 0 && index < this.pageCount()) {
      this.pageIndex.set(index);
    }
  }
}