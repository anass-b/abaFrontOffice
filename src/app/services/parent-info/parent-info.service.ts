import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { ParentInfo } from '../../models/parent-info.model';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ParentInfoService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private baseUrl = `${environment.apiUrl}/parentinfo`;

  getByUserId(userId: number): Observable<ParentInfo | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(() => this.http.get<ParentInfo>(`${this.baseUrl}/user/${userId}`)),
      catchError(() => of(null))
    );
  }

  create(info: ParentInfo): Observable<ParentInfo | null> {
    return this.http.post<ParentInfo>(this.baseUrl, info).pipe(
      catchError(() => of(null))
    );
  }

  update(info: ParentInfo): Observable<ParentInfo | null> {
    return this.http.put<ParentInfo>(`${this.baseUrl}/${info.id}`, info).pipe(
      catchError(() => of(null))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
