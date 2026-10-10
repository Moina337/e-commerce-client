import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'shop' },
  {
    path: 'shop',
    loadChildren: () =>
      import('./features/shop/shop.routes').then((module) => module.SHOP_ROUTES),
  },
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then(
        (module) => module.ADMIN_ROUTES,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page.component').then(
        (module) => module.LoginPageComponent,
      ),
  },
  { path: '**', redirectTo: 'shop' },
];
