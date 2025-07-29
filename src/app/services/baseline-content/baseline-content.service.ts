import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { BaselineContent } from '../../models/baseline-content.model';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BaselineContentService extends SharedService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly apiUrl = environment.apiUrl + '/baselinecontent';

  // 📄 Récupérer les contenus de ligne de base pour une tâche
  fetchByTaskId(taskId: number): Observable<BaselineContent[]> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<BaselineContent[]>(`${this.apiUrl}/task/${taskId}`) : of([])),
      catchError(() => of([]))
    );
  }

  // ➕ Créer un contenu de ligne de base avec FormData
  create(formData: FormData): Observable<BaselineContent | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.post<BaselineContent>(this.apiUrl, formData) : of(null)),
      catchError(() => of(null))
    );
  }

  // 🖊️ Modifier (avec ou sans fichier)
  update(id: number, formData: FormData): Observable<BaselineContent | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth
        ? this.http.put<BaselineContent>(`${this.apiUrl}/${id}`, formData)
        : of(null)
      ),
      catchError(() => of(null))
    );
  }

  // ❌ Supprimer
  delete(id: number): Observable<void> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.delete<void>(`${this.apiUrl}/${id}`) : of()),
      catchError(() => of())
    );
  }
}
