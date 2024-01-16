import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../../services/auth/auth.service";

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.validateToken();

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('auth');
};

