import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environments';
import { Document, DocumentCreateRequest, DocumentUpdateRequest } from '../../models/document.model';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DocumentService extends SharedService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly apiUrl = environment.apiUrl + '/document';

  documentsList: Document[] = [];

  // ---------- Streaming ----------
  getStreamUrl(id: number): Observable<string | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? of(`${this.apiUrl}/stream/${id}`) : of({})),
      catchError(() => of({}))
    );
  }

  streamDocumentById(id: number): Observable<Blob | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok
        ? this.http.get(`${this.apiUrl}/stream/${id}`, { responseType: 'blob' })
        : of({})),
      catchError(() => of({}))
    );
  }

  // ---------- Create / Update (FormData) ----------
  addDocument(req: DocumentCreateRequest): Observable<Document | {}> {
    const form = this.buildCreateFormData(req);
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.post<Document>(this.apiUrl, form) : of({})),
      catchError(() => of({}))
    );
  }

updateDocument(req: DocumentUpdateRequest): Observable<Document | {}> {
  const form = this.buildUpdateFormData(req);

  return this.authService.checkAuthentication().pipe(
    switchMap(ok => {
      if (!ok) return of({});
      return this.http.put<Document>(`${this.apiUrl}/${req.id}`, form);
    }),
    catchError(() => of({}))
  );
}

  // ---------- Read ----------
  fetchDocuments(): Observable<Document[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.get<Document[]>(this.apiUrl) : of([])),
      catchError(() => of([]))
    );
  }

  fetchDocumentById(id: number): Observable<Document | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.get<Document>(`${this.apiUrl}/${id}`) : of({})),
      catchError(() => of({}))
    );
  }

  // ---------- Delete ----------
  deleteDocument(id: number | undefined): Observable<void> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.delete<void>(`${this.apiUrl}/${id}`) : of(void 0)),
      catchError(() => of(void 0))
    );
  }

  // ---------- (Optional) Search ----------
  // NOTE: your backend doesn't expose /api/document/search yet.
  // Keep this only if you add that endpoint server-side.
  searchDocuments(searchTerm: string): Observable<Document[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok
        ? this.http.get<Document[]>(`${this.apiUrl}/search`, { params: { q: searchTerm } })
        : of([])),
      catchError(() => of([]))
    );
  }

  // ---------- Helpers ----------
  private buildCreateFormData(req: DocumentCreateRequest): FormData {
    const fd = new FormData();
    fd.append('title', req.title);
    if (req.description) fd.append('description', req.description);
    fd.append('isPremium', String(!!req.isPremium));
    (req.categoryIds ?? []).forEach((id, i) => fd.append(`CategoryIds[${i}]`, String(id)));
    fd.append('file', req.file); // required
    return fd;
  }

private buildUpdateFormData(req: DocumentUpdateRequest): FormData {
  const fd = new FormData();

  fd.append('id', String(req.id));
  fd.append('title', req.title);
  if (req.description) fd.append('description', req.description);
  fd.append('isPremium', String(!!req.isPremium));

(req.categoryIds ?? []).forEach(id =>
  fd.append('CategoryIds', String(id))
);


  // 🔑 important : utiliser "file" comme en création
  if (req.newFile) {
    fd.append('NewFile', req.newFile);
  }



  return fd;
}

}
