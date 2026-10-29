import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Vers la connexion, en gardant l'adresse demandée pour y revenir ensuite
  const toLogin = () =>
    router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });

  // Pas de token : l'utilisateur n'est pas connecté
  if (!auth.accessToken()) {
    return toLogin();
  }

  // Utilisateur déjà connu : on laisse passer
  if (auth.currentUser()) {
    return true;
  }

  // Token présent mais utilisateur inconnu (après un F5) : on le recharge
  return auth.getCurrentUser().pipe(
    map((): boolean | UrlTree => true),
    catchError(() => {
      auth.logout(); // token invalide ou expiré : on nettoie la session
      return of(toLogin());
    }),
  );
};