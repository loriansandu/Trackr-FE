// // auth.guard.ts
// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import {AuthService} from "../../services/auth/auth.service";
//
//
// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}
//
//   canActivate(): boolean {
//     console.log(this.authService.isAuthenticated())
//     if (this.authService.isAuthenticated()) {
//       return true;
//     } else {
//       // If the user is not authenticated, redirect to the login page
//       this.router.navigate(['']);
//       return false;
//     }
//   }
// }

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

