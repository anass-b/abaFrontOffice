import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { AuthService } from '../auth/auth.service';
import { ResourceCategory } from '../../models/resource-category.model';

@Injectable({ providedIn: 'root' })
export class ResourceCategoryService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly apiUrl = environment.apiUrl + '/resource-categories';

  list(q?: string): Observable<ResourceCategory[]> {
    return this.auth.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.get<ResourceCategory[]>(this.apiUrl, { params: q ? { q } : {} }) : of([])),
      catchError(() => of([]))
    );
  }

  get(id: number): Observable<ResourceCategory | {}> {
    return this.auth.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.get<ResourceCategory>(`${this.apiUrl}/${id}`) : of({})),
      catchError(() => of({}))
    );
  }

  create(dto: ResourceCategory): Observable<ResourceCategory | {}> {
    return this.auth.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.post<ResourceCategory>(this.apiUrl, dto) : of({})),
      catchError(() => of({}))
    );
  }

  update(dto: ResourceCategory): Observable<ResourceCategory | {}> {
    return this.auth.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.put<ResourceCategory>(`${this.apiUrl}/${dto.id}`, dto) : of({})),
      catchError(() => of({}))
    );
  }

  remove(id: number): Observable<void> {
    return this.auth.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.delete<void>(`${this.apiUrl}/${id}`) : of(void 0)),
      catchError(() => of(void 0))
    );
  }
  // services/resource-category/resource-category.service.ts
checkName(name: string) {
  return this.auth.checkAuthentication().pipe(
    switchMap(ok => ok
      ? this.http.get<{ available: boolean }>(`${this.apiUrl}/check-name`, { params: { name } })
      : of({ available: false })
    )
  );
}

}
