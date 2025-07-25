import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AbllsTask } from '../../models/ablls-task.model';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AbllsTaskService extends SharedService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly apiUrl = environment.apiUrl + '/abllstask';

  // 📃 Récupérer toutes les tâches
  fetchTasks(): Observable<AbllsTask[]> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<AbllsTask[]>(this.apiUrl) : of([])),
      catchError(() => of([]))
    );
  }

  // 🔍 Récupérer une tâche par ID
  fetchTaskById(id: number): Observable<AbllsTask | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<AbllsTask>(`${this.apiUrl}/${id}`) : of(null)),
      catchError(() => of(null))
    );
  }

  // ➕ Créer une nouvelle tâche
  createTask(task: AbllsTask): Observable<AbllsTask | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.post<AbllsTask>(this.apiUrl, task) : of(null)),
      catchError(() => of(null))
    );
  }

  // 🔄 Modifier une tâche
  updateTask(task: AbllsTask): Observable<AbllsTask | null> {
    if (!task.id) return of(null);
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.put<AbllsTask>(`${this.apiUrl}/${task.id}`, task) : of(null)),
      catchError(() => of(null))
    );
  }

  // ❌ Supprimer une tâche
  deleteTask(id: number): Observable<void> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.delete<void>(`${this.apiUrl}/${id}`) : of()),
      catchError(() => of())
    );
  }
}
