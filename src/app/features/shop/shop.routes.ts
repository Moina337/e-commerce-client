import { Routes } from '@angular/router';
import { ShopLayoutComponent } from './shop-layout/shop-layout.component';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: ShopLayoutComponent,
    children: [
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
        path: '',
        loadComponent: () =>
          import('./pages/home-page/home-page.component').then(
            (module) => module.HomePageComponent,
          ),
      },
    ],
  },
];
