import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../pages/auth/shared/services/auth.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/logowanie']);
    return false;
  }

  const isAdmin = authService.isAdmin();

  if (!isAdmin) {
    router.navigate(['/moje-pojazdy']);
  }

  return isAdmin;
};
