import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../../core/services/category.service';

@Component({
  imports: [DatePipe, MatButtonModule, MatTableModule, RouterLink],
  templateUrl: './liste-categorie.component.html',
  styleUrl: './liste-categorie.component.css',
})
export class CategoriesPageComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = this.categoryService.categories;
  readonly loading = this.categoryService.loading;
  readonly error = this.categoryService.error;

  readonly displayedColumns = ['name', 'slug', 'createdAt', 'actions'];

  constructor() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  deleteCategory(id: number): void {
    this.categoryService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
