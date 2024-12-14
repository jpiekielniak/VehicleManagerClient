import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../pages/auth/shared/services/auth.service";
import {LoadingService} from "../../shared/services/loading/loading.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  loadingService.setLoading(true);

  try {
    const isLoggedIn = authService.isLoggedIn();
    loadingService.setLoading(false);

    if (isLoggedIn) {
      return true;
    }

    return router.createUrlTree(['/logowanie'], {
      queryParams: { returnUrl: state.url }
    });
  } catch (error) {
    loadingService.setLoading(false);
    return router.createUrlTree(['/logowanie']);
  }
};
