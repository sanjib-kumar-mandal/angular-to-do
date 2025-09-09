import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  try {
    const isLoggedin = await authService.user.isLoggedin();
    if (isLoggedin) {
      return true; // allow access
    }
    // redirect if not logged in
    return router.createUrlTree(['/authentication/login'], {
      queryParams: { redirectURL: state.url },
    });
  } catch (e) {
    return router.createUrlTree(['/authentication/login']);
  }
};
