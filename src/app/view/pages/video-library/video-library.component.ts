import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { VideoService } from '../../../services/video/video.service';
import { SharedService } from '../../../services/shared/shared.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ResourceCategoryService } from '../../../services/resource-category/resource-category.service';

import { Video } from '../../../models/video.model';
import { environment } from '../../../../environments/environments';

type SortKey = 'recent' | 'title' | 'duration';

@Component({
  selector: 'app-video-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './video-library.component.html',
  styleUrls: ['./video-library.component.scss']
})
export class VideoLibraryComponent implements OnInit {
  // Services
  private videoService = inject(VideoService);
  private rcService = inject(ResourceCategoryService);
  private router = inject(Router);
  private sharedService = inject(SharedService);
  auth = inject(AuthService);

  // Data
  videos: Video[] = [];
  filtered: Video[] = [];

  // UI state
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';
  sortBy: SortKey = 'recent';
  loading = true;

  // Pagination (4x4)
  pageSize = 16;
  paginationThreshold = 12; // show pagination only if filtered > 12
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];

  // Player (optional)
  videoUrl: string | null = null;
  selectedVideoId: number | null | undefined = null;

  get pagedVideos(): Video[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchVideos();
  }

  // -------- Data loading --------
  fetchCategories(): void {
    this.rcService.list().subscribe({
      next: (cats) => {
        this.categories = (cats ?? []).map(c => c.name).filter(Boolean);
      },
      error: () => this.sharedService.displaySnackBar('Erreur chargement des catégories')
    });
  }

  fetchVideos(): void {
    this.loading = true;
    this.videoService.fetchVideos().subscribe({
      next: (data) => {
        this.videos = (data ?? [])
          .map(v => ({
            ...v,
            thumbnailUrl: v.thumbnailUrl ? this.ensureAbsoluteUrl(v.thumbnailUrl) : this.placeholderThumb(),
            url: v.url ? (/^https?:\/\//i.test(v.url) ? v.url : this.ensureAbsoluteUrl(v.url)) : undefined
          }))
          .filter(v =>
            // Only keep items user can see in grid
            this.auth.isAdmin ||
            this.auth.isOwner({ createdBy: v.createdBy! }) ||
            this.auth.hasAccessToContent({
              isPremium: v.isPremium ?? false,
              createdBy: v.createdBy!
            })
          );

        this.filterVideos();
        this.loading = false;
      },
      error: () => {
        this.sharedService.displaySnackBar('Erreur lors du chargement des vidéos');
        this.loading = false;
      }
    });
  }

  // -------- Filtering / Search / Sort --------
  selectCategory(category: string): void {
    this.selectedCategory = (category === this.selectedCategory) ? '' : category;
    this.filterVideos();
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.sortBy = 'recent';
    this.filterVideos();
  }

  filterVideos(): void {
    const term = this.searchTerm.trim().toLowerCase();

    let list = this.videos.filter(v => {
      const matchesCategory = !this.selectedCategory || (v.categories ?? []).includes(this.selectedCategory);
      const matchesSearch =
        !term ||
        (v.title ?? '').toLowerCase().includes(term) ||
        (v.description ?? '').toLowerCase().includes(term) ||
        (v.categories ?? []).some(c => (c || '').toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });

    switch (this.sortBy) {
      case 'recent':
        list.sort((a, b) => this.dateDesc(a.updatedAt || a.createdAt, b.updatedAt || b.createdAt));
        break;
      case 'title':
        list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', 'fr', { sensitivity: 'base' }));
        break;
      case 'duration':
        list.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
    }

    this.filtered = list;

    // reset page & recompute pagination
    this.currentPage = 1;
    this.recomputePagination();
  }

  // -------- Pagination --------
  private recomputePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    try {
      document.querySelector('.video-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  }

  // -------- Actions --------
  viewVideo(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/videos', id, 'view']);
  }

  editVideo(video: Video): void {
   this.router.navigate(['/admin/videos/new'], {
    state: { updateMode: true, video }
  });
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

    if (video.url) {
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
    if (!minutes && minutes !== 0) return '';
    const min = Math.floor(minutes);
    const sec = Math.round((minutes - min) * 60);
    return sec ? `${min}:${String(sec).padStart(2, '0')}` : `${min}:00`;
  }

  // -------- Helpers --------
  private ensureAbsoluteUrl(u?: string): string {
    if (!u) return '';
    return /^https?:\/\//i.test(u)
      ? u
      : `${environment.apiUrl}${u.startsWith('/') ? '' : '/'}${u}`;
  }

  private placeholderThumb(): string {
    return '/assets/img/video-placeholder.jpg';
  }

  private dateDesc(a?: string, b?: string): number {
    const ta = a ? new Date(a).getTime() : 0;
    const tb = b ? new Date(b).getTime() : 0;
    return tb - ta;
  }
}
