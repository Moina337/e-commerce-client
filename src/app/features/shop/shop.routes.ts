import { Routes } from '@angular/router';
import { ShopLayoutComponent } from './shop-layout.component';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: ShopLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home-page.component').then(
            (module) => module.HomePageComponent,
          ),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
