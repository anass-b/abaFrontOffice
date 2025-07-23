import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Subscription } from '../../models/subscription.model';
import { AuthService } from '../auth/auth.service';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends SharedService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly apiUrl = environment.apiUrl + '/subscription';

  // ➕ Ajouter un abonnement
  addSubscription(subscription: Subscription): Observable<Subscription | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap((isAuth) => {
        if (!isAuth) return of({});
        return this.http.post<Subscription>(this.apiUrl, subscription);
      }),
      catchError(() => of({}))
    );
  }

  // 📄 Obtenir tous les abonnements
  fetchAll(): Observable<Subscription[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap((isAuth) => {
        if (!isAuth) return of([]);
        return this.http.get<Subscription[]>(this.apiUrl);
      }),
      catchError(() => of([]))
    );
  }

  // 📄 Obtenir un abonnement par ID
  fetchById(id: number): Observable<Subscription | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap((isAuth) => {
        if (!isAuth) return of({});
        return this.http.get<Subscription>(`${this.apiUrl}/${id}`);
      }),
      catchError(() => of({}))
    );
  }

  // 🔁 Modifier un abonnement
  updateSubscription(id: number, subscription: Subscription): Observable<Subscription | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap((isAuth) => {
        if (!isAuth) return of({});
        return this.http.put<Subscription>(`${this.apiUrl}/${id}`, subscription);
      }),
      catchError(() => of({}))
    );
  }

  // ❌ Supprimer un abonnement
  deleteSubscription(id: number): Observable<void> {
    return this.authService.checkAuthentication().pipe(
      switchMap((isAuth) => {
        if (!isAuth) return of();
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }),
      catchError(() => of())
    );
  }
}
