import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <main class="login-page">
      <section class="login-card">
        <h1>Connexion</h1>
        <p>Connectez-vous à votre compte.</p>

        @if (error()) {
          <p class="error-state" role="alert">{{ error() }}</p>
        }

        <form [formGroup]="form" (ngSubmit)="login()">
          <mat-form-field appearance="outline">
            <mat-label>Adresse e-mail</mat-label>
            <input matInput type="email" formControlName="email" />
            @if (form.controls.email.hasError('required')) {
              <mat-error>L’adresse e-mail est obligatoire.</mat-error>
            } @else if (form.controls.email.hasError('email')) {
              <mat-error>Saisissez une adresse e-mail valide.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Mot de passe</mat-label>
            <input matInput type="password" formControlName="password" />
            @if (form.controls.password.hasError('required')) {
              <mat-error>Le mot de passe est obligatoire.</mat-error>
            }
          </mat-form-field>

          <button
            mat-flat-button
            type="submit"
            [disabled]="form.invalid || loading()"
          >
            {{ loading() ? 'Connexion…' : 'Se connecter' }}
          </button>
        </form>
      </section>
    </main>
  `,
  styles: `
    .login-page {
      display: grid;
      min-height: 100vh;
      box-sizing: border-box;
      padding: 24px;
      place-items: center;
      background: #f8f9fc;
    }

    .login-card {
      width: min(100%, 420px);
      box-sizing: border-box;
      padding: 32px;
      border: 1px solid #e8ebf2;
      border-radius: 12px;
      background: #fff;
    }

    h1 {
      margin: 0;
      color: #1c2740;
    }

    .login-card > p:not(.error-state) {
      margin: 8px 0 24px;
      color: #68738b;
    }

    form {
      display: grid;
      gap: 8px;
    }

    .error-state {
      color: #b42318;
    }
  `,
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly loading = this.authService.loading;
  readonly error = this.authService.error;
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  login(): void {
    if (this.form.invalid) {
      return;
    }

    this.authService
      .login(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) =>
          void this.router.navigate([
            user.role === 'ADMIN' ? '/admin' : '/shop',
          ]),
        error: () => undefined,
      });
  }
}
