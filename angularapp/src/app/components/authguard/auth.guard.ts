import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  const decoded: any = jwtDecode(token);

  const role = decoded.UserRole;
  const allowedRole = route.data?.['role'];

  if (allowedRole && role !== allowedRole) {
    return router.createUrlTree(['/']);
  }

  return true;
};
