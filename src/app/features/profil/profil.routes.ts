import { Routes } from '@angular/router';

export const PROFIL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
  },
];