import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  accessToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'access_token';

  readonly currentUser = signal<User | null>(null);
  readonly accessToken = signal<string | null>(
    localStorage.getItem(this.tokenKey),
  );
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  login(credentials: LoginCredentials): Observable<User> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, credentials)
      .pipe(
        switchMap((response) => {
          const token = response.accessToken ?? response.token;
          if (!token) {
            return throwError(
              () => new Error('La réponse de connexion ne contient pas de token.'),
            );
          }
          this.setToken(token);
          return this.fetchCurrentUser();
        }),
        tap((user) => this.currentUser.set(user)),
        catchError((error: unknown) => {
          this.error.set(this.getErrorMessage(error));
          this.clearSession();
          return throwError(() => error);
        }),
        finalize(() => this.loading.set(false)),
      );
  }

  getCurrentUser(): Observable<User> {
    this.loading.set(true);
    this.error.set(null);
    return this.fetchCurrentUser().pipe(
      tap((user) => this.currentUser.set(user)),
      catchError((error: unknown) => {
        this.error.set(this.getErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  logout(): void {
    this.clearSession();
  }

  private fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/users/me`);
  }

  private setToken(token: string): void {
    this.accessToken.set(token);
    localStorage.setItem(this.tokenKey, token);
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(this.tokenKey);
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
      : 'Une erreur est survenue lors de la connexion.';
  }
}
