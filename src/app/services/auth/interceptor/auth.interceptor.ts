import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { switchMap, catchError, from, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

let refreshInProgress = false;
let refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const userDataString = localStorage.getItem(authService.sharedService.CURRENT_USER_KEY);
  if (!userDataString) return next(req);

  let token = '';
  let refreshToken = '';

  try {
    const parsed = JSON.parse(userDataString);
    token = parsed?.token || '';
    refreshToken = parsed?.refreshToken || '';
  } catch {
    return next(req);
  }

  // 🔕 Skip certains endpoints (login, OTP, etc.)
  if (!token || req.url.includes('auth') || req.url.includes('verificationCode') || req.url.includes('signDocument')) {
    return next(req);
  }

  try {
    jwtDecode(token); // juste pour s'assurer qu'il est valide
  } catch {
    authService.logOut();
    return throwError(() => new HttpErrorResponse({
      error: 'Invalid token',
      status: 401,
      statusText: 'Unauthorized'
    }));
  }

  // ⏳ Token expiré ? rafraîchir
  if (authService.isTokenExpired(token)) {
    if (!refreshInProgress) {
      refreshInProgress = true;
      refreshSubject.next(null);

      return from(authService.refreshTokens({ token, refreshToken })).pipe(
        switchMap((newTokens: any) => {
          refreshInProgress = false;

          // ✅ Mise à jour des tokens dans AuthService
          authService.currentUser = {
            ...authService.currentUser,
            token: newTokens.token,
            refreshToken: newTokens.refreshToken
          };
          localStorage.setItem(
            authService.sharedService.CURRENT_USER_KEY,
            JSON.stringify(authService.currentUser)
          );

          // 👨‍💼 Réévalue isAdmin et autres infos
          authService.updateCurrentUser(authService.currentUser);

          refreshSubject.next(newTokens.token);

          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newTokens.token}` }
          });
          return next(retryReq);
        }),
        catchError(() => {
          refreshInProgress = false;
          refreshSubject.next(null);
          authService.logOut();

          return throwError(() => new HttpErrorResponse({
            error: 'Token refresh failed',
            status: 401,
            statusText: 'Unauthorized'
          }));
        })
      );
    } else {
      // En attente d’un refresh déjà en cours
      return refreshSubject.pipe(
        filter((t): t is string => t !== null),
        take(1),
        switchMap((newToken) => {
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          return next(retryReq);
        })
      );
    }
  }

  // ✅ Token encore valide
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(clonedReq);
};
