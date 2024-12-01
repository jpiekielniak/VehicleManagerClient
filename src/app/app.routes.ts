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
    loadComponent: () => import('./pages/auth/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: 'rejestracja',
    loadComponent: () => import('./pages/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: 'moje-pojazdy',
    loadComponent: () => import('./pages/vehicle/vehicles/vehicles.component').then(m => m.VehiclesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'moje-pojazdy/:id',
    loadComponent: () => import('./pages/vehicle/vehicle-details/vehicle-details.component').then(m => m.VehicleDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'moje-konto',
    loadComponent: () => import('./pages/user-details/user-details.component').then(m => m.UserDetailsComponent),
    canActivate: [authGuard]
  },
];
