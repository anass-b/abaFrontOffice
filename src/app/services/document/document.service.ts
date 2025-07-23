import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environments';
import { Document } from '../../models/document.model';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends SharedService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  

  private readonly apiUrl = environment.apiUrl + '/document';

  documentsList: Document[] = [];

  // 📥 Ajouter un document (FormData)
  addDocument(documentForm: FormData): Observable<Document | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.post<Document>(this.apiUrl, documentForm);
      }),
      catchError(() => of({}))
    );
  }

  // 🔄 Modifier un document
  updateDocument(id: number, documentForm: FormData): Observable<Document | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.put<Document>(`${this.apiUrl}/${id}`, documentForm);
      }),
      catchError(() => of({}))
    );
  }

  // 📃 Obtenir tous les documents
  fetchDocuments(): Observable<Document[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of([]);
        return this.http.get<Document[]>(this.apiUrl);
      }),
      catchError(() => of([]))
    );
  }

  // 🔍 Obtenir un document par ID
  fetchDocumentById(id: number): Observable<Document | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.get<Document>(`${this.apiUrl}/${id}`);
      }),
      catchError(() => of({}))
    );
  }

  // ❌ Supprimer un document
  deleteDocument(id: number | undefined): Observable<void> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of();
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }),
      catchError(() => of())
    );
  }

  // 🔍 Rechercher des documents
  searchDocuments(searchTerm: string): Observable<Document[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of([]);
        return this.http.get<Document[]>(`${this.apiUrl}/search`, {
          params: { q: searchTerm }
        });
      }),
      catchError(() => of([]))
    );
  }
}
