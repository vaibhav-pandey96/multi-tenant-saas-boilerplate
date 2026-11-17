
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];
  const user = authService.user();

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (allowedRoles.includes(user.role)) {
    return true;
  }

  // Redirect according to the user's actual role
  switch (user.role) {

    case 'SUPER_ADMIN':
      return router.createUrlTree(['/superadmin']);

    case 'ADMIN':
      return router.createUrlTree(['/admin']);

    default:
      return router.createUrlTree(['/dashboard']);
  }
};
