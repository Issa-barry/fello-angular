import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

   // Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié
  router.navigate(['/auth/login']);
  return false;
};
