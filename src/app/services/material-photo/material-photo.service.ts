import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { MaterialPhoto } from '../../models/material-photo.model';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialPhotoService extends SharedService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly apiUrl = environment.apiUrl + '/materialphoto';

  fetchAll(): Observable<MaterialPhoto[]> {
      return this.auth.checkAuthentication().pipe(
        switchMap(result => {
          if (!result) return of([]);
          return this.http.get<MaterialPhoto[]>(this.apiUrl);
        }),
        catchError(() => of([]))
      );
    }

  // 📄 Récupérer les fichiers matériels liés à une tâche
  fetchByTaskId(taskId: number): Observable<MaterialPhoto[]> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<MaterialPhoto[]>(`${this.apiUrl}/task/${taskId}`) : of([])),
      catchError(() => of([]))
    );
  }

  // ➕ Créer une entrée manuelle (sans fichier)
  create(photo: MaterialPhoto): Observable<MaterialPhoto | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.post<MaterialPhoto>(this.apiUrl, photo) : of(null)),
      catchError(() => of(null))
    );
  }

  // 🖊️ Modifier une photo
  update(photo: MaterialPhoto): Observable<MaterialPhoto | null> {
    if (!photo.id) return of(null);
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.put<MaterialPhoto>(`${this.apiUrl}/${photo.id}`, photo) : of(null)),
      catchError(() => of(null))
    );
  }

  // 📁 Upload fichier matériel (PDF, image, vidéo)
  uploadMaterialFile(formData: FormData): Observable<any> {
  return this.auth.checkAuthentication().pipe(
    switchMap(auth =>
      auth
        ? this.http.post(`${this.apiUrl}`, formData) // <== même endpoint
        : of(null)
    ),
    catchError(() => of(null))
  );
}


  // ❌ Supprimer une photo
  delete(id: number): Observable<void> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.delete<void>(`${this.apiUrl}/${id}`) : of()),
      catchError(() => of())
    );
  }
}
