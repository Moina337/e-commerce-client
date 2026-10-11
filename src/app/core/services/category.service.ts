import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../../shared/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/admin/categories`;

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  getAll(): Observable<Category[]> {
    return this.track(this.http.get<Category[]>(this.endpoint)).pipe(
      tap((categories) => this.categories.set(categories)),
    );
  }

  getById(id: number): Observable<Category> {
    return this.track(
      this.http.get<Category>(`${this.endpoint}/${id}`),
    ).pipe(tap((category) => this.upsert(category)));
  }

  add(name: string): Observable<Category> {
    return this.track(
      this.http.post<Category>(this.endpoint, { name }),
    ).pipe(tap((category) => this.upsert(category)));
  }

  update(id: number, name: string): Observable<Category> {
    return this.track(
      this.http.put<Category>(`${this.endpoint}/${id}`, { name }),
    ).pipe(tap((category) => this.upsert(category)));
  }

  delete(id: number): Observable<void> {
    return this.track(
      this.http.delete<void>(`${this.endpoint}/${id}`),
    ).pipe(
      tap(() =>
        this.categories.update((categories) =>
          categories.filter((category) => category.id !== id),
        ),
      ),
    );
  }

  private upsert(category: Category): void {
    this.categories.update((categories) => {
      const exists = categories.some((item) => item.id === category.id);
      return exists
        ? categories.map((item) => (item.id === category.id ? category : item))
        : [...categories, category];
    });
  }

  private track<T>(request: Observable<T>): Observable<T> {
    this.loading.set(true);
    this.error.set(null);
    return request.pipe(
      tap({
        error: (error: unknown) => this.error.set(this.getErrorMessage(error)),
      }),
      finalize(() => this.loading.set(false)),
    );
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
      : 'Une erreur est survenue lors du chargement des catégories.';
  }
}
