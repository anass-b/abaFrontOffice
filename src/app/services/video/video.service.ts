import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environments';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';
import { Video } from '../../models/video.model';

@Injectable({ providedIn: 'root' })
export class VideoService extends SharedService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly apiUrl = environment.apiUrl + '/video';

  videosList: Video[] = [];

  // ---------- Create / Update (JSON) ----------
  addVideo(video: Video): Observable<Video | {}> {
    // Expected: { title, url, categoryIds, ... }
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.post<Video>(this.apiUrl, video) : of({})),
      catchError(() => of({}))
    );
  }

  updateVideo(video: Video): Observable<Video | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.put<Video>(`${this.apiUrl}/${video.id}`, video) : of({})),
      catchError(() => of({}))
    );
  }

  // ---------- Read ----------
  fetchVideos(): Observable<Video[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.get<Video[]>(this.apiUrl) : of([])),
      catchError(() => of([]))
    );
  }

  fetchVideoById(id: number): Observable<Video | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.get<Video>(`${this.apiUrl}/${id}`) : of({})),
      catchError(() => of({}))
    );
  }

  // ---------- Delete ----------
  deleteVideo(id: number | undefined): Observable<void> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok ? this.http.delete<void>(`${this.apiUrl}/${id}`) : of(void 0)),
      catchError(() => of(void 0))
    );
  }

  // ---------- Streaming proxy (blob) ----------
  streamVideoById(id: number | undefined): Observable<Blob | null> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok
        ? this.http.get(`${this.apiUrl}/stream/${id}`, { responseType: 'blob' })
        : of(null)),
      catchError(() => of(null))
    );
  }

  // ---------- (Optional) Search ----------
  // NOTE: your backend doesn't expose /api/video/search yet.
  searchVideos(searchTerm: string): Observable<Video[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(ok => ok
        ? this.http.get<Video[]>(`${this.apiUrl}/search`, { params: { q: searchTerm } })
        : of([])),
      catchError(() => of([]))
    );
  }
}
