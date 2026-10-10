import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard-page.component').then(
            (module) => module.DashboardPageComponent,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products-page.component').then(
            (module) => module.ProductsPageComponent,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders-page.component').then(
            (module) => module.OrdersPageComponent,
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers-page.component').then(
            (module) => module.CustomersPageComponent,
          ),
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
