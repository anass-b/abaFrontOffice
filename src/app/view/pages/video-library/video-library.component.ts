import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { VideoService } from '../../../services/video/video.service';
import { SharedService } from '../../../services/shared/shared.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CategoryService } from '../../../services/category/category.service';

import { Video } from '../../../models/video.model';
import { Category } from '../../../models/category.model';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-video-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './video-library.component.html',
  styleUrls: ['./video-library.component.scss']
})
export class VideoLibraryComponent implements OnInit {
  videoService = inject(VideoService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  sharedService = inject(SharedService);
  auth = inject(AuthService);

  videos: Video[] = [];
  filtered: Video[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';
  loading = true;
  videoUrl: string | null = null;
  selectedVideoId: number | null | undefined = null;

  ngOnInit() {
    this.fetchCategories();
    this.fetchVideos();
  }

  fetchCategories() {
    this.categoryService.getAll().subscribe({
      next: (cats) => {
        this.categories = cats.map(c => c.name);
      },
      error: () => this.sharedService.displaySnackBar("Erreur chargement des catégories")
    });
  }

  fetchVideos() {
    this.loading = true;
    this.videoService.fetchVideos().subscribe({
      next: (data) => {
        this.videos = data
          .map(video => ({
            ...video,
            thumbnailUrl: `${environment.apiUrl}${video.thumbnailUrl}`,
            url: video.useExternal ? video.url : `${environment.apiUrl}${video.url}`
          }))
          .filter(video =>
            this.auth.isAdmin ||
            this.auth.isOwner({ createdBy: video.createdBy! }) ||
            this.auth.hasAccessToContent({
              isPremium: video.isPremium ?? false,
              createdBy: video.createdBy!
            })
          );

        this.filterVideos();
        this.loading = false;
      },
      error: () => {
        this.sharedService.displaySnackBar("Erreur lors du chargement des vidéos");
        this.loading = false;
      }
    });
  }

  filterVideos(): void {
  this.filtered = this.videos.filter(video =>
    (!this.selectedCategory || video.categories?.some(cat => cat.name === this.selectedCategory)) &&
    (!this.searchTerm || video.title?.toLowerCase().includes(this.searchTerm.toLowerCase()))
  );
}

  filteredVideos(): Video[] {
    return this.filtered;
  }

  selectCategory(category: string): void {
    this.selectedCategory = (category === this.selectedCategory) ? '' : category;
    this.filterVideos();
  }

  viewVideo(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/videos', id, 'view']);
  }

  editVideo(video: Video): void {
    this.router.navigate(['/videos/edit', video.id]);
  }

  deleteVideo(video: Video): void {
    if (confirm(`Supprimer la vidéo "${video.title}" ?`)) {
      this.videoService.deleteVideo(video.id).subscribe(() => this.fetchVideos());
    }
  }

  playVideo(videoId: number | undefined): void {
    this.selectedVideoId = videoId;
    this.videoService.streamVideoById(videoId).subscribe(blob => {
      this.videoUrl = blob ? URL.createObjectURL(blob) : null;
    });
  }

  openVideoInNewTab(videoId: number | undefined): void {
    const video = this.videos.find(v => v.id === videoId);
    if (!video) return;

    if (video.useExternal && video.url) {
      window.open(video.url, '_blank');
    } else {
      this.videoService.streamVideoById(videoId).subscribe(blob => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        }
      });
    }
  }

  canAccess(video: Video): boolean {
    return this.auth.hasAccessToContent({
      isPremium: video.isPremium ?? false,
      createdBy: video.createdBy!
    });
  }

  formatDuration(minutes: number | undefined): string {
    if (!minutes) return '';
    const min = Math.floor(minutes);
    const sec = Math.round((minutes - min) * 60);
    return `${min} min${sec > 0 ? ` ${sec} sec` : ''}`;
  }
}
