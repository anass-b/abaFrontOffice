import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environments';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../auth/auth.service';
import { BlogPost } from '../../models/blog-post.model';
import { BlogComment } from '../../models/blog-comment.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService extends SharedService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  

  private readonly postUrl = environment.apiUrl + '/blogpost';
  private readonly commentUrl = environment.apiUrl + '/blogcomment';

  // 📃 Obtenir tous les articles
  fetchPosts(): Observable<BlogPost[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of([]);
        return this.http.get<BlogPost[]>(this.postUrl);
      }),
      catchError(() => of([]))
    );
  }

  // 📃 Obtenir un article par ID
  fetchPostById(id: number): Observable<BlogPost | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.get<BlogPost>(`${this.postUrl}/${id}`);
      }),
      catchError(() => of({}))
    );
  }

  // ➕ Ajouter un article
  addPost(post: BlogPost): Observable<BlogPost | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.post<BlogPost>(this.postUrl, post);
      }),
      catchError(() => of({}))
    );
  }

  // 🔁 Modifier un article
  updatePost(id: number, post: BlogPost): Observable<BlogPost | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.put<BlogPost>(`${this.postUrl}/${id}`, post);
      }),
      catchError(() => of({}))
    );
  }

  // ❌ Supprimer un article
  deletePost(id: number): Observable<void> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of();
        return this.http.delete<void>(`${this.postUrl}/${id}`);
      }),
      catchError(() => of())
    );
  }

  // 💬 Ajouter un commentaire
  addComment(comment: BlogComment): Observable<BlogComment | {}> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of({});
        return this.http.post<BlogComment>(this.commentUrl, comment);
      }),
      catchError(() => of({}))
    );
  }

  // 💬 Obtenir tous les commentaires
  fetchComments(): Observable<BlogComment[]> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of([]);
        return this.http.get<BlogComment[]>(this.commentUrl);
      }),
      catchError(() => of([]))
    );
  }

  // ❌ Supprimer un commentaire
  deleteComment(id: number): Observable<void> {
    return this.authService.checkAuthentication().pipe(
      switchMap(result => {
        if (!result) return of();
        return this.http.delete<void>(`${this.commentUrl}/${id}`);
      }),
      catchError(() => of())
    );
  }
}
