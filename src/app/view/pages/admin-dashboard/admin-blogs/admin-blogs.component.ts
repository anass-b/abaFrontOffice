import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../../services/blog/blog.service';
import { BlogPost } from '../../../../models/blog-post.model';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-blogs.component.html',
  styleUrls: ['./admin-blogs.component.scss']
})
export class AdminBlogsComponent implements OnInit {
  blogService = inject(BlogService);
  posts: BlogPost[] = [];

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.blogService.fetchPosts().subscribe(data => {
      this.posts = data;
      console.log(this.posts)
    });
  }

  deletePost(id: number): void {
    if (confirm('Supprimer cet article ?')) {
      this.blogService.deletePost(id).subscribe(() => this.loadPosts());
    }
  }
}
