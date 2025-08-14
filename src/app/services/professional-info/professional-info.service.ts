import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { ProfessionalInfo } from '../../models/professional-info.model';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProfessionalInfoService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private baseUrl = `${environment.apiUrl}/professionalinfo`;

  getByUserId(userId: number): Observable<ProfessionalInfo | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(() => this.http.get<ProfessionalInfo>(`${this.baseUrl}/user/${userId}`)),
      catchError(() => of(null))
    );
  }

  create(info: ProfessionalInfo): Observable<ProfessionalInfo | null> {
    return this.http.post<ProfessionalInfo>(this.baseUrl, info).pipe(
      catchError(() => of(null))
    );
  }

  update(info: ProfessionalInfo): Observable<ProfessionalInfo | null> {
    return this.http.put<ProfessionalInfo>(`${this.baseUrl}/${info.id}`, info).pipe(
      catchError(() => of(null))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
