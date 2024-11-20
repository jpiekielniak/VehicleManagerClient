import {Routes} from '@angular/router';
import {authGuard} from './guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'moje-pojazdy',
    pathMatch: 'full'
  },
  {
    path: 'logowanie',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'rejestracja',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'moje-pojazdy',
    loadComponent: () => import('./components/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'moje-pojazdy/:id',
    loadComponent: () => import('./components/vehicle-details/vehicle-details.component').then(m => m.VehicleDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'moje-konto',
    loadComponent: () => import('./components/user-details/user-details.component').then(m => m.UserDetailsComponent),
    canActivate: [authGuard]
  }
];
