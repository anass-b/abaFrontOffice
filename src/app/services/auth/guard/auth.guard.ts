import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 👇 Vérifie l'état d'authentification, rafraîchit le token si expiré
  return auth.checkAuthentication().pipe(
    tap((authenticated) => {
      if (!authenticated) {
        router.navigateByUrl('/login');
      }
    })
  );
};
