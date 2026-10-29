import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard'; 
import { ShopLayoutComponent } from './shop-layout/shop-layout.component';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: ShopLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/home-page/home-page.component').then(
            (module) => module.HomePageComponent,
          ),
      },
      {
        path: 'shop/products',
        redirectTo: 'shop',
      },
      {
        path: 'shop',
        loadComponent: () =>
          import('./pages/shop-page/shop-page.component').then(
            (module) => module.ShopPageComponent,
          ),
      },
      {
        path: 'shop/product/:slug',
        loadComponent: () =>
          import('./pages/product-page/product-page.component').then(
            (module) => module.ProductPageComponent,
          ),
      },
      {
        path: 'shop/cart',
        loadComponent: () =>
          import('./pages/cart-page/cart-page.component').then(
            (module) => module.CartPageComponent,
          ),
      },
      {
        path: 'profil',
        canActivate: [authGuard],
        loadChildren: () =>
          import('../profil/profil.routes').then((m) => m.PROFIL_ROUTES),
      },
    ],
  },
];