import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoService } from '../../../services/video/video.service';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category/category.service';
import { OnInit } from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
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

  videoForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categories: [[]],
    duration: [null],
    isPremium: [false],
    useExternal: [false],
    url: [''], // si external video
    thumbnail: [null], // image miniature
    video: [null] // fichier vidéo uploadé
  });

  thumbnailPreview: string | null = null;
  uploading = false;
  videoName = '';
  thumbnailName = '';

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


  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.videoForm.patchValue({ thumbnail: file });
      this.thumbnailName = file.name;

      const reader = new FileReader();
      reader.onload = () => (this.thumbnailPreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.videoForm.patchValue({ video: file });
      this.videoName = file.name;
    }
  }

  onSubmit(): void {
    if (this.videoForm.invalid) return;

    const formData = new FormData();
    const values = this.videoForm.value;

    formData.append('title', values.title);
    formData.append('description', values.description || '');
    if (values.categories?.length) {
      values.categories.forEach((cat: string) => formData.append('categories', cat));
    }

    formData.append('duration', values.duration?.toString() || '0');
    formData.append('isPremium', values.isPremium.toString());
    formData.append('useExternal', values.useExternal.toString());

    if (values.useExternal && values.url) {
      formData.append('url', values.url);
    } else if (values.video) {
      formData.append('File', values.video); // 👈 bien "video", à faire correspondre avec le paramètre dans le backend
    }

    if (values.thumbnail) {
      formData.append('thumbnail', values.thumbnail);
    }

    this.uploading = true;
    this.videoService.addVideo(formData).subscribe({
      next: () => {
        this.uploading = false;
        this.router.navigateByUrl('/videos');
      },
      error: () => {
        this.uploading = false;
        alert("Erreur lors de l'envoi de la vidéo");
      }
    });
  }
}
