import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../../../services/blog/blog.service';
import { BlogPost } from '../../../models/blog-post.model';
import { BlogComment } from '../../../models/blog-comment.model';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { forkJoin, of , switchMap } from 'rxjs';

type CommentWithAuthor = BlogComment & { author?: any };

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  blogService = inject(BlogService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);

  post: BlogPost | null = null;
  author: any = null;
  comments: CommentWithAuthor[] = [];
  commentForm!: FormGroup;
  loading = true;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (!id) return;

    this.blogService.fetchPostById(+id).subscribe({
      next: (data) => {
        this.post = data as BlogPost;
        this.loading = false;

        // 👤 Charger l'auteur du post
        if (this.post.authorId) {
          this.userService.getUserById(this.post.authorId).subscribe(user => {
            this.author = user;
          });
        }

        // 💬 Charger les commentaires du post avec auteurs
        this.blogService.fetchComments().subscribe((comments) => {
          const filtered = comments.filter(c => c.postId === +id);

          const authorRequests = filtered.map(comment =>
            this.userService.getUserById(comment.userId!).pipe(
              switchMap(author => of({ ...comment, author }))
            )
          );

          forkJoin(authorRequests).subscribe((commentsWithAuthors: CommentWithAuthor[]) => {
            this.comments = commentsWithAuthors;
          });
        });

        // 📝 Initialiser le formulaire de commentaire
        this.commentForm = this.formBuilder.group({
          content: ['', [Validators.required, Validators.minLength(2)]]
        });
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/blog']);
      }
    });
  }

  submitComment() {
    if (this.commentForm.invalid || !this.post) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const newComment: BlogComment = {
      postId: this.post.id!,
      content: this.commentForm.value.content,
      createdAt: new Date().toISOString(),
      userId: currentUser.id,
    };

    this.blogService.addComment(newComment).subscribe((comment: any) => {
      // Ajouter l'auteur courant directement
      const commentWithAuthor: CommentWithAuthor = {
        ...comment,
        author: currentUser
      };
      this.comments.push(commentWithAuthor);
      this.commentForm.reset();
    });
  }

  formatDate(date?: string): string {
    return date ? new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    }) : '';
  }
}
