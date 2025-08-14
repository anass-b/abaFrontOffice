import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Child } from '../../models/child.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChildService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/child`;

  getByParentInfoId(parentInfoId: number): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.baseUrl}/parent/${parentInfoId}`).pipe(
      catchError(() => of([]))
    );
  }

  create(child: Child): Observable<Child | null> {
    return this.http.post<Child>(this.baseUrl, child).pipe(
      catchError(() => of(null))
    );
  }

  update(child: Child): Observable<Child | null> {
    return this.http.put<Child>(`${this.baseUrl}/${child.id}`, child).pipe(
      catchError(() => of(null))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
