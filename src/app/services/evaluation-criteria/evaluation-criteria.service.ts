import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { EvaluationCriteria } from '../../models/evaluation-criteria.model';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationCriteriaService extends SharedService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly apiUrl = environment.apiUrl + '/evaluationcriteria';
  baseUrl = environment.apiUrl + '/evaluationcriteriamaterial';


  createLink(evaluationCriteriaId: number, materialPhotoId: number) {
    return this.http.post(this.baseUrl, {
      evaluationCriteriaId,
      materialPhotoId
    });
  }
  fetchById(Id: number): Observable<EvaluationCriteria[]> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<EvaluationCriteria[]>(`${this.apiUrl}/${Id}`) : of([])),
      catchError(() => of([]))
    );
  }
  // 📄 Tous les critères d'une tâche
  fetchByTaskId(taskId: number): Observable<EvaluationCriteria[]> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<EvaluationCriteria[]>(`${this.apiUrl}/task/${taskId}`) : of([])),
      catchError(() => of([]))
    );
  }

  // ➕ Créer un critère
  create(evaluationCriteriaId: number, materialPhotoId: number): Observable<any> {
  return this.auth.checkAuthentication().pipe(
    switchMap(auth =>
      auth
        ? this.http.post(`${this.baseUrl}`, {
            evaluationCriteriaId,
            materialPhotoId
          })
        : of(null)
    ),
    catchError(() => of(null))
  );
}


  // 🔁 Modifier un critère
  update(criteria: EvaluationCriteria): Observable<EvaluationCriteria | null> {
    if (!criteria.id) return of(null);
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.put<EvaluationCriteria>(`${this.apiUrl}/${criteria.id}`, criteria) : of(null)),
      catchError(() => of(null))
    );
  }

  // ❌ Supprimer un critère
  delete(id: number): Observable<void> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.delete<void>(`${this.apiUrl}/${id}`) : of()),
      catchError(() => of())
    );
  }
}
