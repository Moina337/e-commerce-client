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
          import('./pages/dashboard/dashboard-page.component').then(
            (module) => module.DashboardPageComponent,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/liste-produit/liste-produit.component').then(
            (module) => module.ProductsPageComponent,
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/liste-categorie/liste-categorie.component').then(
            (module) => module.CategoriesPageComponent,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders/liste-commandes/liste-commandes.component').then(
            (module) => module.OrdersPageComponent,
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./pages/customers/liste-clients/liste-clients.component').then(
            (module) => module.CustomersPageComponent,
          ),
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
