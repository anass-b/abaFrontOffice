import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { VideoService } from '../../../services/video/video.service';
import { ResourceCategoryService } from '../../../services/resource-category/resource-category.service';
import { SharedService } from '../../../services/shared/shared.service';

import { Video } from '../../../models/video.model';
import { ResourceCategory } from '../../../models/resource-category.model';

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
  rcService = inject(ResourceCategoryService);
  sharedService = inject(SharedService);

  allCategories: ResourceCategory[] = [];
  updateMode = false;
videoIdToEdit?: number;
rowVersion?: number;


  // JSON form (no file upload)
  videoForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categoryIds: [[] as number[]],
    duration: [null],
    isPremium: [false],
    url: ['', [Validators.required, Validators.pattern(/^(https?:\/\/).+/i)]],
    thumbnailUrl: ['']
  });

  submitting = false;

 ngOnInit() {
  this.rcService.list().subscribe({
    next: (cats) => {
      this.allCategories = (cats || []).map(c => ({
        ...c,
        name: this.sharedService.fixEncoding(c.name),
        description: c.description ? this.sharedService.fixEncoding(c.description) : undefined
      }));

      // 🔎 Mode édition via history.state
      const data = history.state;
      if (data && data.updateMode && data.video) {
        this.updateMode = true;
        this.videoIdToEdit = data.video.id;
        this.rowVersion = data.video.rowVersion;
        this.populateForm(data.video);
      }
    },
    error: () => alert('Erreur lors du chargement des catégories')
  });
}
populateForm(video: Video): void {
  this.videoForm.patchValue({
    title: video.title ?? '',
    description: video.description ?? '',
    categoryIds: video.categoryIds ?? [],
    duration: video.duration ?? null,
    isPremium: !!video.isPremium,
    url: video.url ?? '',
    thumbnailUrl: video.thumbnailUrl ?? ''
  });
}


  onSubmit(): void {
  if (this.videoForm.invalid || this.submitting) return;
  this.submitting = true;

  const v = this.videoForm.value;
  const payload: Video = {
    id: this.videoIdToEdit,                         // présent en update
    title: (v.title || '').trim(),
    description: v.description || undefined,
    categoryIds: (v.categoryIds as number[]) ?? [],
    duration: v.duration != null ? Number(v.duration) : undefined,
    url: (v.url || '').trim(),
    thumbnailUrl: v.thumbnailUrl || undefined,
    isPremium: !!v.isPremium,
    // useExternal sera géré côté serveur si tu le forces à true
    rowVersion: this.rowVersion                     // si ton back l’utilise
  };

  const obs = this.updateMode && this.videoIdToEdit
    ? this.videoService.updateVideo(payload)        // 🔄 update
    : this.videoService.addVideo(payload);          // ➕ create

  obs.subscribe({
    next: () => {
      this.submitting = false;
      this.router.navigateByUrl('/admin/videoList');
    },
    error: (err) => {
      this.submitting = false;
      const msg = (err?.error?.message || '').toString().toLowerCase().includes('host')
        ? 'URL non autorisée par le serveur (hôte non supporté).'
        : (this.updateMode ? 'Erreur lors de la mise à jour de la vidéo.' : 'Erreur lors de l’enregistrement de la vidéo.');
      alert(msg);
    }
  });
}

}
