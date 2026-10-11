import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../../shared/models/page.model';
import { Product } from '../../shared/models/product.model';
import { ProductImage } from '../../shared/models/product-image.model';
import { ProductRequest } from '../../shared/models/product-request.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/admin/products`;

  readonly products = signal<Product[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.endpoint}/${id}`);
  }

  add(data: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.endpoint, data);
  }

  update(id: number, data: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.endpoint}/${id}`, data);
  }

  uploadImage(productId: number, file: File): Observable<ProductImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ProductImage>(
      `${this.endpoint}/${productId}/images`,
      formData,
    );
  }

  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/api/admin/images/${imageId}`,
    );
  }

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
