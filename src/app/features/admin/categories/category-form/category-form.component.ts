import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  readonly isEditingMode = signal(false);
  private categoryId: string | null = null;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id');
      this.categoryId = id;
      this.isEditingMode.set(id !== null);

      if (id === null) {
        this.form.reset();
        return;
      }

      const category = this.categoryService.getById(id);
      if (!category) {
        void this.router.navigate(['/admin/categories']);
        return;
      }

      this.form.patchValue({ name: category.name });
    });
  }

  saveCategory(): void {
    if (this.form.invalid) {
      return;
    }

    const name = this.form.controls.name.value;
    if (this.categoryId) {
      if (!this.categoryService.update(this.categoryId, name)) {
        void this.router.navigate(['/admin/categories']);
        return;
      }
    } else {
      this.categoryService.add(name);
    }

    this.form.reset();
    void this.router.navigate(['/admin/categories']);
  }
}
