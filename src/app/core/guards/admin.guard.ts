import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.accessToken()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.currentUser()) {
    return authService.isAdmin() ? true : router.createUrlTree(['/shop']);
  }

  return authService.getCurrentUser().pipe(
    map((user) =>
      user.role === 'ADMIN' ? true : router.createUrlTree(['/shop']),
    ),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
