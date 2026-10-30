import { Routes } from '@angular/router';

export const PROFIL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
  },
  {
  path: 'orders',
  loadComponent: () =>
    import('./my-orders/orders-page/orders-page.component').then(
      (module) => module.OrdersPageComponent,
    ),
},
{
  path: 'orders/:id',
  loadComponent: () =>
    import('./my-orders/order-detail-page/order-detail-page.component').then(
      (module) => module.OrderDetailPageComponent,
    ),
},
];