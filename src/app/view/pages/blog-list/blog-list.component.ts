import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog/blog.service';
import { AuthService } from '../../../services/auth/auth.service';
import { BlogPost } from '../../../models/blog-post.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  private blogService = inject(BlogService);
  auth = inject(AuthService);
  isAdmin$ = this.auth.isAdmin$;

  posts: BlogPost[] = [];
  loading = true;

  ngOnInit(): void {
    this.blogService.fetchPosts().subscribe({
      next: (data) => {
        this.posts = data.filter(p => p.isPublished);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  excerpt(html: string | undefined): string {
    const div = document.createElement('div');
    div.innerHTML = html ?? '';
    const text = div.textContent || div.innerText || '';
    return text.length > 150 ? text.slice(0, 150) + '...' : text;
  }
}
