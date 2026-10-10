import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../../core/services/category.service';

@Component({
  imports: [MatButtonModule, MatTableModule, RouterLink],
  templateUrl: './liste-categorie.component.html',
  styleUrl: './liste-categorie.component.css',
})
export class CategoriesPageComponent {
  private readonly categoryService = inject(CategoryService);

  readonly categories = this.categoryService.categories;

  readonly displayedColumns = ['name', 'status', 'actions'];
}
