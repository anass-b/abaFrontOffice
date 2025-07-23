import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../services/blog/blog.service';
import { BlogPost } from '../../../models/blog-post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss']
})
export class BlogEditorComponent {
  blogService = inject(BlogService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  post: BlogPost = {
    title: '',
    content: '',
    category: '',
    isPublished: false
  };

  isEdit = false;
  loading = false;
  saving = false;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.blogService.fetchPostById(+id).subscribe(post => {
        this.post = post as BlogPost;
        this.loading = false;
      });
    }
  }

  savePost() {
    this.saving = true;

    if (this.post.isPublished && !this.post.publishedAt) {
      this.post.publishedAt = new Date().toISOString();
    }

    const request = this.isEdit
      ? this.blogService.updatePost(this.post.id!, this.post)
      : this.blogService.addPost(this.post);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/blog']);
      },
      error: () => {
        this.saving = false;
        alert("Erreur lors de l'enregistrement de l'article.");
      }
    });
  }
}
