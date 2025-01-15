import {Routes} from '@angular/router';
import {authGuard} from './guards/auth/auth.guard';
import {adminGuard} from "./guards/admin/admin.guard";

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
    path: 'resetowanie-hasla',
    loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
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
  {
    path: 'panel-administracyjny',
    loadComponent: () => import('./pages/admin/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'informacje-o-aplikacji',
    loadComponent: () => import('./pages/about-us/about-us.component').then(m => m.AboutUsComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
