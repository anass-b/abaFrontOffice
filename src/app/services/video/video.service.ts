import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environments';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';
import { Video } from '../../models/video.model';



@Injectable({
  providedIn: 'root'
})
export class VideoService extends SharedService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  

  private readonly apiUrl = environment.apiUrl + '/video';

  videosList: Video[] = [];

  // 📥 Ajouter une vidéo (FormData)
  addVideo(videoForm: FormData): Observable<Video | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.post<Video>(this.apiUrl, videoForm);
      }),
      catchError(() => of({}))
    );
  }

  // 🔄 Modifier une vidéo
  updateVideo(id: number, videoForm: FormData): Observable<Video | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.put<Video>(`${this.apiUrl}/${id}`, videoForm);
      }),
      catchError(() => of({}))
    );
  }

  // 📃 Obtenir toutes les vidéos
  fetchVideos(): Observable<Video[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of([]);
        return this.http.get<Video[]>(this.apiUrl);
      }),
      catchError(() => of([]))
    );
  }

  // 🔍 Obtenir une vidéo par ID
  fetchVideoById(id: number): Observable<Video | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.get<Video>(`${this.apiUrl}/${id}`);
      }),
      catchError(() => of({}))
    );
  }

  // ❌ Supprimer une vidéo
  deleteVideo(id: number | undefined): Observable<void> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of();
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }),
      catchError(() => of())
    );
  }
  // 📺 Stream vidéo sécurisée
streamVideoById(id: number | undefined): Observable<Blob | null> {
  return this.authService.checkAuthentication().pipe(
    switchMap(result => {
      if (!result) return of(null);

      return this.http.get(`${this.apiUrl}/stream/${id}`, {
        responseType: 'blob'  // 👈 IMPORTANT pour la vidéo
      });
    }),
    catchError(() => of(null))
  );
}


  // 🔍 Rechercher une vidéo
  searchVideos(searchTerm: string): Observable<Video[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of([]);
        return this.http.get<Video[]>(`${this.apiUrl}/search`, {
          params: { q: searchTerm }
        });
      }),
      catchError(() => of([]))
    );
  }
}
