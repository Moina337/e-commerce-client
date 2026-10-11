import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
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
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';
import { ProductImage } from '../../../shared/models/product-image.model';
import { ProductRequest } from '../../../shared/models/product-request.model';
import { environment } from '../../../../environments/environment';

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
export class ProductFormComponent implements OnDestroy {
  private readonly partialUploadError =
    'Produit créé, mais l’image n’a pas pu être envoyée';
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
  readonly files = signal<File[]>([]);
  readonly filePreviews = signal<string[]>([]);
  readonly existingImages = signal<ProductImage[]>([]);
  readonly deletingImageIds = signal<number[]>([]);
  readonly apiUrl = environment.apiUrl;

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
      const navigationError =
        this.router.getCurrentNavigation()?.extras.state?.['uploadError'];
      if (typeof navigationError === 'string') {
        this.error.set(navigationError);
      }
      this.productService
        .getById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (product) =>
            this.loadProduct(product),
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

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input.files ?? []);
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith('image/'),
    );

    this.files.update((files) => [...files, ...imageFiles]);
    this.filePreviews.update((previews) => [
      ...previews,
      ...imageFiles.map((file) => URL.createObjectURL(file)),
    ]);
    input.value = '';
  }

  removeFile(index: number): void {
    const previews = this.filePreviews();
    URL.revokeObjectURL(previews[index]);
    this.files.update((files) => files.filter((_, fileIndex) => fileIndex !== index));
    this.filePreviews.update((current) =>
      current.filter((_, previewIndex) => previewIndex !== index),
    );
  }

  deleteExistingImage(image: ProductImage): void {
    if (this.deletingImageIds().includes(image.id)) {
      return;
    }

    this.deletingImageIds.update((ids) => [...ids, image.id]);
    this.error.set(null);
    this.productService
      .deleteImage(image.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.existingImages.update((images) =>
            images.filter((current) => current.id !== image.id),
          );
          this.deletingImageIds.update((ids) =>
            ids.filter((id) => id !== image.id),
          );
        },
        error: (error: unknown) => {
          this.error.set(this.getErrorMessage(error));
          this.deletingImageIds.update((ids) =>
            ids.filter((id) => id !== image.id),
          );
        },
      });
  }

  imageUrl(url: string): string {
    return new URL(url, environment.apiUrl).toString();
  }

  submit(): void {
    if (
      this.form.invalid ||
      this.saving() ||
      this.deletingImageIds().length > 0 ||
      this.existingImages().length + this.files().length === 0
    ) {
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
    const productId = this.productId;
    const selectedFiles = this.files();
    const request: Observable<{ product: Product; uploadFailed: boolean }> =
      productId === null
        ? this.productService.add(data).pipe(
            switchMap((product) =>
              this.uploadFiles(product.id, selectedFiles).pipe(
                map(() => ({ product, uploadFailed: false })),
                catchError(() => {
                  this.error.set(this.partialUploadError);
                  return of({ product, uploadFailed: true });
                }),
              ),
            ),
          )
        : this.productService.update(productId, data).pipe(
            switchMap((product) =>
              this.uploadFiles(product.id, selectedFiles).pipe(
                map(() => ({ product, uploadFailed: false })),
              ),
            ),
          );
    this.saving.set(true);
    this.error.set(null);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: ({ product, uploadFailed }) => {
        this.saving.set(false);
        if (uploadFailed) {
          void this.router.navigate(
            ['/admin/products', product.id, 'edit'],
            { state: { uploadError: this.partialUploadError } },
          );
          return;
        }
        void this.router.navigate(['/admin/products']);
      },
      error: (error: unknown) => {
        this.error.set(this.getErrorMessage(error));
        this.saving.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.filePreviews().forEach((previewUrl) =>
      URL.revokeObjectURL(previewUrl),
    );
  }

  private loadProduct(product: Product): void {
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.category.id,
    });
    this.existingImages.set(product.images);
  }

  private uploadFiles(
    productId: number,
    files: File[],
  ): Observable<ProductImage[]> {
    if (files.length === 0) {
      return of<ProductImage[]>([]);
    }
    return forkJoin(
      files.map((file) => this.productService.uploadImage(productId, file)),
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
      : 'Une erreur est survenue lors de l’enregistrement du produit.';
  }
}
