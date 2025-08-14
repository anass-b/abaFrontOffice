import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoService } from '../../../services/video/video.service';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category/category.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedService } from '../../../services/shared/shared.service';


@Component({
  selector: 'app-add-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  videoService = inject(VideoService);
  categoryService = inject(CategoryService);
  sharedService = inject(SharedService);

  allCategories: Category[] = [];

  // URL-only form (no file upload)
  videoForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categories: [[]],
    duration: [null],
    isPremium: [false],
    // useExternal is forced to true at submit
    url: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)[^\s]+$/i)]],
    thumbnailUrl: [''] // optional
  });

  uploading = false;

  ngOnInit() {
    this.categoryService.getAll().subscribe({
      next: (cats) => {
        this.allCategories = cats.map(cat => ({
          ...cat,
          name: this.sharedService.fixEncoding(cat.name),
          description: this.sharedService.fixEncoding(cat.description)
        }));
      },
      error: () => alert('Erreur lors du chargement des catégories')
    });
  }

  onSubmit(): void {
    if (this.videoForm.invalid) return;

    const values = this.videoForm.value;
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('description', values.description || '');
    if (values.categories?.length) {
      values.categories.forEach((cat: string) => formData.append('categories', cat));
    }
    if (values.duration != null) {
      formData.append('duration', values.duration.toString());
    }

    formData.append('isPremium', values.isPremium.toString());
    formData.append('useExternal', 'true');     // 🔒 force external mode
    formData.append('url', values.url);         // 🔑 backend expects Url

    if (values.thumbnailUrl) {
      formData.append('thumbnailUrl', values.thumbnailUrl); // optional (URL)
    }

    this.uploading = true;
    this.videoService.addVideo(formData).subscribe({
      next: () => {
        this.uploading = false;
        this.router.navigateByUrl('/videos');
      },
      error: () => {
        this.uploading = false;
        alert('Erreur lors de l\'envoi de la vidéo');
      }
    });
  }
}
