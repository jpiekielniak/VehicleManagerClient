import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'logowanie',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'rejestracja',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  }
];
