import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';
import { AbllsVideo } from '../../models/ablls-video.model';

@Injectable({
  providedIn: 'root'
})
export class AbllsVideoService extends SharedService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly apiUrl = environment.apiUrl + '/abllsvideo';

  // ➕ Ajouter une vidéo ABLLS (FormData)
  addAbllsVideo(videoForm: FormData): Observable<AbllsVideo | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.post<AbllsVideo>(this.apiUrl, videoForm) : of(null)),
      catchError(() => of(null))
    );
  }

  // 🔄 Modifier une vidéo ABLLS (FormData)
  updateAbllsVideo(id: number, videoForm: FormData): Observable<AbllsVideo | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.put<AbllsVideo>(`${this.apiUrl}/${id}`, videoForm) : of(null)),
      catchError(() => of(null))
    );
  }

  // 📃 Obtenir toutes les vidéos ABLLS
  fetchVideos(): Observable<AbllsVideo[]> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<AbllsVideo[]>(this.apiUrl) : of([])),
      catchError(() => of([]))
    );
  }

  // 🔍 Obtenir une vidéo ABLLS par ID
  fetchVideoById(id: number): Observable<AbllsVideo | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.get<AbllsVideo>(`${this.apiUrl}/${id}`) : of(null)),
      catchError(() => of(null))
    );
  }

  // ❌ Supprimer une vidéo
  deleteVideo(id: number): Observable<void> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth ? this.http.delete<void>(`${this.apiUrl}/${id}`) : of()),
      catchError(() => of())
    );
  }

  // 📺 Stream vidéo ABLLS
  streamVideoById(id: number): Observable<Blob | null> {
    return this.auth.checkAuthentication().pipe(
      switchMap(auth => auth
        ? this.http.get(`${this.apiUrl}/stream/${id}`, { responseType: 'blob' })
        : of(null)
      ),
      catchError(() => of(null))
    );
  }
}
