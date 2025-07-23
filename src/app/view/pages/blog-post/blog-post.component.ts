import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog/blog.service';
import { BlogPost } from '../../../models/blog-post.model';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent {
  blogService = inject(BlogService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  post: BlogPost | null = null;
  loading = true;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (!id) return;

    this.blogService.fetchPostById(+id).subscribe({
      next: (data) => {
        this.post = data as BlogPost;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/blog']); // Rediriger si erreur
      }
    });
  }

  formatDate(date?: string): string {
    return date ? new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    }) : '';
  }
}
