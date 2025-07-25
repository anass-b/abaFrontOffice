import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environments';
import { AuthService } from '../auth/auth.service';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly baseUrl = `${environment.apiUrl}/category`;

  // 📥 Obtenir toutes les catégories
  getAll(): Observable<Category[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of([]);
        return this.http.get<Category[]>(this.baseUrl);
      }),
      catchError(() => of([]))
    );
  }

  // 👁️ Obtenir une catégorie par ID
  getById(id: number): Observable<Category | null> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of(null);
        return this.http.get<Category>(`${this.baseUrl}/${id}`);
      }),
      catchError(() => of(null))
    );
  }

  // ➕ Créer une catégorie
  create(category: Category): Observable<Category | null> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of(null);
        return this.http.post<Category>(this.baseUrl, category);
      }),
      catchError(() => of(null))
    );
  }

  // ♻️ Modifier une catégorie
  update(id: number, category: Category): Observable<Category | null> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of(null);
        return this.http.put<Category>(`${this.baseUrl}/${id}`, category);
      }),
      catchError(() => of(null))
    );
  }

  // ❌ Supprimer une catégorie
  delete(id: number): Observable<void> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of();
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
      }),
      catchError(() => of())
    );
  }
}
