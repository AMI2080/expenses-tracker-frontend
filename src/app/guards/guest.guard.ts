import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isAuthenticated = localStorage.getItem('token') !== null;

  if (isAuthenticated) {
    router.navigate(['/']);
    return false;
  }

  return true;
};


