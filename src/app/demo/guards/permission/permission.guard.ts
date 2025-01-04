import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../../service/permission/permission.service';
import { map, catchError, of } from 'rxjs';
import { MessageService } from 'primeng/api';

export const permissionGuard: CanActivateFn = (route, state) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);
  // const messageService = inject(MessageService);

  // Récupérer la permission requise depuis les données de la route
  const requiredPermission = route.data?.['permission'];
  // console.log('Permission requise :', requiredPermission);

  // ID du rôle utilisateur (temporairement statique pour le test)
  const userRoleId = 2; // Remplacez par une méthode dynamique si nécessaire

  return permissionService.getRolePermissions(userRoleId).pipe(
    map((permissions) => {
      // console.log('Réponse API brut :', permissions);

      // Extraire les noms des permissions
      const permissionNames = permissions.map((perm) => perm.name);
      // console.log('Guard : Noms des permissions utilisateur :', permissionNames);

      const hasPermission = permissionNames.includes(requiredPermission);
      // console.log('L\'utilisateur a-t-il la permission ? :', hasPermission);

      // Retourner true pour forcer l'accès, même si la permission est fausse (pour débogage)
      // if (!hasPermission) {
        
      //   router.navigate(['/unauthorized']); // Redirection
      // }

      return hasPermission;
    }),
    catchError((error) => {
      console.error('Erreur lors de la vérification des permissions :', error);
      router.navigate(['/unauthorized']); // Redirige en cas d'erreur
      // messageService.add({
      //   severity: 'error',
      //   summary: 'Accès refusé',
      //   detail: 'Vous n\'avez pas la permission requise pour accéder à cette page.',
      //   life: 3000,
      // });
      return of(false); // Retourner true pour permettre l'accès malgré l'erreur
    })
  );
};
