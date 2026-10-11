import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../../shared/models/page.model';
import { Product } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/admin/products`;

  readonly products = signal<Product[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Pagination is server-side; each page event requests a fresh slice.
  load(page = 0, size = 20): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<Page<Product>>(this.endpoint, { params: { page, size } })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => {
          this.products.set(result.content);
          this.total.set(result.totalElements);
        },
        error: (error: unknown) => {
          this.error.set(this.getErrorMessage(error));
        },
      });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as { message?: unknown } | null;
      if (typeof body?.message === 'string') {
        return body.message;
      }
      return error.message;
    }
    return error instanceof Error
      ? error.message
      : 'Une erreur est survenue lors du chargement des produits.';
  }
}
