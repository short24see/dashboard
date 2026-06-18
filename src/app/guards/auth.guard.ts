import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Login } from '../services/login';

export const authGuard: CanActivateFn = () => {
  const loginService = inject(Login);
  const router = inject(Router);

  if (loginService.isLoggedIn()) {
    return true;
  }

  loginService.clearInvalidSession();
  return router.createUrlTree(['/login']);
};
