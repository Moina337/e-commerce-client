import { Component, DestroyRef, inject, signal } from '@angular/core';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  readonly isEditingMode = signal(false);
  readonly loading = this.categoryService.loading;
  readonly error = this.categoryService.error;
  private categoryId: number | null = null;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const routeId = params.get('id');
      if (routeId === null) {
        this.categoryId = null;
        this.isEditingMode.set(false);
        this.form.reset();
        return;
      }

      const id = Number(routeId);
      if (!Number.isInteger(id)) {
        void this.router.navigate(['/admin/categories']);
        return;
      }

      this.categoryId = id;
      this.isEditingMode.set(true);
      this.categoryService
        .getById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (category) => this.form.patchValue({ name: category.name }),
          error: () => undefined,
        });
    });
  }

  saveCategory(): void {
    if (this.form.invalid) {
      return;
    }

    const name = this.form.controls.name.value;
    const request = this.categoryId
      ? this.categoryService.update(this.categoryId, name)
      : this.categoryService.add(name);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.form.reset();
        void this.router.navigate(['/admin/categories']);
      },
      error: () => undefined,
    });
  }
}
