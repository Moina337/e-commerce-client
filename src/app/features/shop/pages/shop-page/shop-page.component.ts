
import { Component, computed,inject,  signal } from '@angular/core';

import { ShopProductService } from '../../../../core/services/shop-product.service'; 
import { ShopProduct } from '../../../../shared/models/shop-product.model';

import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component';

type ProductSortOrder = 'default' | 'name' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [ProductCardComponent, AppButtonComponent],
  templateUrl: './shop-page.component.html',
  styleUrl: './shop-page.component.css',
})
export class ShopPageComponent {

  private readonly service = inject(ShopProductService);

  private readonly products = this.service.products;
  readonly loading = this.service.loading;
  readonly error = this.service.error;

  constructor() {
    this.service.loadProducts();
  }

  readonly pageSize = 4;

  readonly searchTerm = signal('');
  readonly selectedCategoryId = signal<number | null>(null);
  readonly sortOrder = signal<ProductSortOrder>('default');
  readonly pageIndex = signal(0);

  readonly categories = computed(() => {
    const unique = new Map(
      this.products()
        .filter((product) => product.category != null)
        .map((product) => [
          product.category.id,
          product.category,
        ]),
    );

    return [...unique.values()];
  });

  readonly filteredProducts = computed(() => {
    const search = this.searchTerm().trim().toLocaleLowerCase('fr');
    const categoryId = this.selectedCategoryId();

    const result = this.products().filter((product) => {
      const categoryName = product.category?.name ?? '';
      const name = product.name ?? '';
      const description = product.description ?? '';

      const searchableText =
        `${name} ${description} ${categoryName}`.toLocaleLowerCase('fr');

      const matchesSearch =
        search.length === 0 || searchableText.includes(search);

      const matchesCategory =
        categoryId === null || product.category?.id === categoryId;

      return matchesSearch && matchesCategory;
    });

    switch (this.sortOrder()) {
      case 'name':
        return result.sort((a, b) =>
          a.name.localeCompare(b.name, 'fr'),
        );

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

  readonly safePageIndex = computed(() =>
    Math.min(
      this.pageIndex(),
      Math.max(0, this.pageCount() - 1),
    ),
  );

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.pageCount() }, (_, index) => index),
  );

  readonly paginatedProducts = computed(() => {
    const start = this.safePageIndex() * this.pageSize;

    return this.filteredProducts().slice(
      start,
      start + this.pageSize,
    );
  });

  readonly firstVisibleProduct = computed(() => {
    if (this.filteredProducts().length === 0) {
      return 0;
    }

    return this.safePageIndex() * this.pageSize + 1;
  });

  readonly lastVisibleProduct = computed(() =>
    Math.min(
      (this.safePageIndex() + 1) * this.pageSize,
      this.filteredProducts().length,
    ),
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

    this.selectedCategoryId.set(
      value === '' ? null : Number(value),
    );

    this.pageIndex.set(0);
  }

  onSortChange(event: Event): void {
    if (!(event.target instanceof HTMLSelectElement)) {
      return;
    }

    this.sortOrder.set(
      event.target.value as ProductSortOrder,
    );

    this.pageIndex.set(0);
  }

  goToPage(index: number): void {
    if (index >= 0 && index < this.pageCount()) {
      this.pageIndex.set(index);
    }
  }

  onAddToCart(product: ShopProduct): void {
    // À remplacer par l'appel au service du panier.
    console.log('Produit sélectionné :', product.name);
  }
}
