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
    loadComponent: () => import('./components/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: 'rejestracja',
    loadComponent: () => import('./components/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: 'moje-pojazdy',
    loadComponent: () => import('./components/vehicles/vehicles.component').then(m => m.VehiclesComponent),
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
  },
];
