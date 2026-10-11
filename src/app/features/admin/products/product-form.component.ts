import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';
import { ProductRequest } from '../../../shared/models/product-request.model';

const integerValidator: ValidatorFn = (control) =>
  Number.isInteger(control.value) ? null : { integer: true };

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [
      0,
      [Validators.required, Validators.min(0), integerValidator],
    ],
    categoryId: this.formBuilder.control<number | null>(null, Validators.required),
  });
  readonly isEditing = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly categories = this.categoryService.categories;
  readonly categoriesLoading = this.categoryService.loading;
  readonly categoriesError = this.categoryService.error;

  private productId: number | null = null;

  constructor() {
    this.categoryService.load();
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const routeId = params.get('id');
      if (routeId === null) {
        this.productId = null;
        this.isEditing.set(false);
        this.form.reset({
          name: '',
          description: '',
          price: 0,
          stockQuantity: 0,
          categoryId: null,
        });
        return;
      }

      const id = Number(routeId);
      if (!Number.isInteger(id) || id < 1) {
        void this.router.navigate(['/admin/products']);
        return;
      }

      this.productId = id;
      this.isEditing.set(true);
      this.error.set(null);
      this.productService
        .getById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (product) =>
            this.form.patchValue({
              name: product.name,
              description: product.description,
              price: product.price,
              stockQuantity: product.stockQuantity,
              categoryId: product.category.id,
            }),
          error: (error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 404) {
              void this.router.navigate(['/admin/products']);
              return;
            }
            this.error.set(this.getErrorMessage(error));
          },
        });
    });
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    if (formValue.categoryId === null) {
      return;
    }
    const data: ProductRequest = {
      ...formValue,
      categoryId: formValue.categoryId,
    };
    const request = this.productId === null
      ? this.productService.add(data)
      : this.productService.update(this.productId, data);

    this.saving.set(true);
    this.error.set(null);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/admin/products']);
      },
      error: (error: unknown) => {
        this.error.set(this.getErrorMessage(error));
        this.saving.set(false);
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
      : 'Une erreur est survenue lors de l’enregistrement du produit.';
  }
}
