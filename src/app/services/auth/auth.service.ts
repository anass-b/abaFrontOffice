import { inject, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, switchMap, of, Observable } from 'rxjs';

import { environment } from '../../../environments/environments';
import { LoginData } from '../../models/auth/login-data.model';
import { UpdatePasswordModel } from '../../models/update-password.model';
import { AuthUser } from '../../models/auth/auth-user.model';
import { SharedService } from '../shared/shared.service';
import { User } from '../../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from '../../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  jwtHelper = inject(JwtHelperService);
  sharedService = inject(SharedService);

  readonly apiUrl = environment.apiUrl + '/auth';
  refreshInProgress = false;
  userSubscription: Subscription | null = null;

  private isAdminSubject = new BehaviorSubject<boolean>(false);

  isAdmin$ = this.isAdminSubject.asObservable();

  public currentUser: AuthUser = {};

  ngOnInit(): void {
    const storedUser = localStorage.getItem(this.sharedService.CURRENT_USER_KEY);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }
  

    private computeIsAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.isadmin === true || decoded?.isadmin === 'true';
  }
  public initializeFromStorage(): void {
  const storedUser = localStorage.getItem(this.sharedService.CURRENT_USER_KEY);
  if (storedUser) {
    this.currentUser = JSON.parse(storedUser);
    this.updateCurrentUser(this.currentUser); 
  }
}


  public updateCurrentUser(authData: AuthUser) {
  this.currentUser = authData;
  localStorage.setItem(this.sharedService.CURRENT_USER_KEY, JSON.stringify(authData));

  // 👇 Decode et mettre à jour le isAdminSubject
  const token = authData.token;
  const decoded = this.jwtHelper.decodeToken(token || '');
  const isAdmin = decoded?.isadmin === true || decoded?.isadmin === 'true';
  this.isAdminSubject.next(isAdmin);
}



  get isAdmin(): boolean {
    return this.computeIsAdmin();
  }


  // 🔐 Authentification
  login(data: LoginData): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
  register(user: User): Observable<any> {
  return this.http.post(`${environment.apiUrl}/user/register`, user);
}

// auth.service.ts
isUserAdmin(): boolean {
  const user = this.getCurrentUser(); // récupère l'objet user décodé du JWT
  return user?.isAdmin === true;
}

isUserClient(): boolean {
  return !this.isUserAdmin();
}



  // ♻️ Refresh JWT + RefreshToken
  refreshTokens(tokens : any): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh`, tokens);
  }

  // 🚪 Déconnexion
  logOut(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  // ✅ Vérifie si utilisateur est connecté
  isLoggedIn(): boolean {
    const stored = localStorage.getItem(this.sharedService.CURRENT_USER_KEY);
    if (!stored) return false;

    this.currentUser = JSON.parse(stored);
    return !!this.currentUser.token;
  }

  // ⏳ Token expiré ?
  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  // 🔐 Vérifie l'authentification et refresh si besoin
  checkAuthentication(): Observable<boolean> {
    if (!this.isLoggedIn()) {
      this.logOut();
      return of(false);
    }

    if (this.refreshInProgress) return of(false);

    if (this.isTokenExpired(this.currentUser.token!)) {
      this.refreshInProgress = true;
      return this.refreshTokens({
        token: this.currentUser.token!,
        refreshToken: this.currentUser.refreshToken!,
      }).pipe(
        switchMap((tokens: any) => {
          this.currentUser.token = tokens.token;
          this.currentUser.refreshToken = tokens.refreshToken;
          localStorage.setItem(this.sharedService.CURRENT_USER_KEY, JSON.stringify(this.currentUser));
          this.refreshInProgress = false;
          return of(true);
        }),
        catchError(() => {
          this.refreshInProgress = false;
          if (this.isTokenExpired(this.currentUser.token!)) {
            this.sharedService.openConfirmationDialog('Désolé, vous devez vous connecter.', true)
              .afterClosed()
              .subscribe(() => this.logOut());
          }
          return of(false);
        })
      );
    }

    return of(true);
  }
  hasAccessToContent(content: { isPremium: boolean; createdBy: number }): boolean {
  const user = this.getCurrentUser();
  if (!user) return false;

  if (user.isAdmin) return true;
  if (!content.isPremium) return true;

  // vérifier abonnement actif PREMIUM
  return (
    this.userSubscription?.type === 'PREMIUM' &&
    !!this.userSubscription?.isActive
  );
}

isOwner(content: { createdBy: number }): boolean {
  return this.getCurrentUser()?.id === content.createdBy;
}




  // 🛠️ Changement de mot de passe
  updatePassword(data: UpdatePasswordModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-password`, data);
  }

  // 🔓 Récupère le token actuel
  getToken(): string | null {
    return this.currentUser?.token ?? null;
  }

  // 🔢 Récupère l'ID utilisateur depuis le token
  getUserId(): number | null {
    try {
      const decoded = this.jwtHelper.decodeToken(this.currentUser.token!);
      return parseFloat(decoded.nameid);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération de l'ID utilisateur :", err);
      return null;
    }
  }
 getCurrentUser(): { id: number; email: string; isAdmin: boolean } | null {
  const token = this.getToken();
  if (!token) return null;

  const decoded = this.jwtHelper.decodeToken(token);
  if (!decoded) return null;

  return {
    id: +decoded.nameid,
    email: decoded.email,
    isAdmin: decoded.isadmin === true || decoded.isadmin === 'true'
  };
}

}


