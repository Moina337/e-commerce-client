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
        path: 'products/new',
        loadComponent: () =>
          import('./products/product-form.component').then(
            (module) => module.ProductFormComponent,
          ),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./products/product-form.component').then(
            (module) => module.ProductFormComponent,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/product-list.component').then(
            (module) => module.ProductListComponent,
          ),
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import('./categories/category-form/category-form.component').then(
            (module) => module.CategoryFormComponent,
          ),
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () =>
          import('./categories/category-form/category-form.component').then(
            (module) => module.CategoryFormComponent,
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
    import('./orders/admin-orders-page/admin-orders-page.component').then(
      (m) => m.AdminOrdersPageComponent,
    ),
},
{
  path: 'orders/:id',
  loadComponent: () =>
    import('./orders/admin-order-detail-page/admin-order-detail-page.component').then(
      (m) => m.AdminOrderDetailPageComponent,
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
