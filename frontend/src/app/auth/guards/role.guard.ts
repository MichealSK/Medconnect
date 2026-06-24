import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { Role } from '../models/user';
import { AuthStateService } from '../services/auth-state';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as Role[];

  if (!authState.isLoggedIn) {
    return router.createUrlTree(['/auth/login']);
  }

  if (requiredRoles?.length && !requiredRoles.includes(authState.currentUser!.role)) {
    return router.createUrlTree(['/403']);
  }

  return true;
};
