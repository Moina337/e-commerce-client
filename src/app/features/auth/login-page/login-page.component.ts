import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';  // ADAPTER

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, AppButtonComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // Où retourner après la connexion (ex. /shop/cart), seulement un chemin interne
  private readonly returnUrl = this.safeReturnUrl(
    this.route.snapshot.queryParamMap.get('returnUrl'),
  );

  constructor() {
    // Déjà connecté : inutile de montrer le formulaire
    const user = this.auth.currentUser();
    if (user) {
      this.router.navigateByUrl(this.destination(user.role));
    }
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: (user) => this.router.navigateByUrl(this.destination(user.role)),
      error: (err) => {
        this.saving.set(false);
        this.error.set(
          err.status === 401 || err.status === 403
            ? 'Email ou mot de passe incorrect.'
            : 'Une erreur est survenue. Réessayez plus tard.',
        );
      },
    });
  }

  private destination(role: string): string {
    if (this.returnUrl) {
      return this.returnUrl;
    }
    return role === 'ADMIN' ? '/admin/dashboard' : '/shop'; // ADAPTER
  }

  private safeReturnUrl(url: string | null): string | null {
    return url && url.startsWith('/') && !url.startsWith('//') ? url : null;
  }
}