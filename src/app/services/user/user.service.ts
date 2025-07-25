import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { User } from '../../models/user.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly baseUrl = `${environment.apiUrl}/user`;

  // 📥 Tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of([]);
        return this.http.get<User[]>(this.baseUrl);
      }),
      catchError(() => of([]))
    );
  }

  // 👤 Un seul utilisateur par ID
  getUserById(id: number): Observable<User | null> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of(null);
        return this.http.get<User>(`${this.baseUrl}/${id}`);
      }),
      catchError(() => of(null))
    );
  }

  // ➕ Créer un utilisateur
  createUser(user: User): Observable<User | null> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of(null);
        return this.http.post<User>(this.baseUrl, user);
      }),
      catchError(() => of(null))
    );
  }

  // ♻️ Mettre à jour un utilisateur
  updateUser(id: number, user: User): Observable<User | null> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of(null);
        return this.http.put<User>(`${this.baseUrl}/${id}`, user);
      }),
      catchError(() => of(null))
    );
  }

  // ❌ Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of();
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
      }),
      catchError(() => of())
    );
  }
}
