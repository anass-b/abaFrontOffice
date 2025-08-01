import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Domain } from '../../models/domain.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly apiUrl = environment.apiUrl + '/domain';

  // 📄 Obtenir tous les domaines
  getAll(): Observable<Domain[]> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<Domain[]>(this.apiUrl) : of([])),
      catchError(() => of([]))
    );
  }

  // 🔍 Obtenir un domaine par ID
  getById(id: number): Observable<Domain | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<Domain>(`${this.apiUrl}/${id}`) : of(null)),
      catchError(() => of(null))
    );
  }

  // 🔁 Obtenir les domaines d'une catégorie
  getByCategory(categoryId: number): Observable<Domain[]> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<Domain[]>(`${this.apiUrl}/byCategory/${categoryId}`) : of([])),
      catchError(() => of([]))
    );
  }

  // ➕ Créer un domaine
  create(domain: Domain): Observable<Domain | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.post<Domain>(this.apiUrl, domain) : of(null)),
      catchError(() => of(null))
    );
  }

  // ♻️ Modifier un domaine
  update(id: number, domain: Domain): Observable<Domain | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.put<Domain>(`${this.apiUrl}/${id}`, domain) : of(null)),
      catchError(() => of(null))
    );
  }

  // ❌ Supprimer un domaine
  delete(id: number): Observable<void> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.delete<void>(`${this.apiUrl}/${id}`) : of()),
      catchError(() => of())
    );
  }
}
