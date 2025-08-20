import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoService } from '../../../services/video/video.service';
import { Video } from '../../../models/video.model';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  videoService = inject(VideoService);
  router = inject(Router);

  videos: Video[] = [];
  searchTerm = '';

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos(): void {
    this.videoService.fetchVideos().subscribe({
      next: (data) => this.videos = data,
      error: (err) => console.error('Erreur chargement vidéos', err)
    });
  }

  getFilteredVideos(): Video[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.videos.filter(v => v.title?.toLowerCase().includes(term));
  }

  goToEditVideo(video: Video): void {
  if (!video) return;
  this.router.navigate(['/admin/videos/new'], {
    state: { updateMode: true, video }
  });
}


  onDelete(id: number |undefined) {
    if (confirm('Confirmer la suppression de cette vidéo ?')) {
      this.videoService.deleteVideo(id).subscribe({
        next: () => this.loadVideos(),
        error: (err) => console.error('Erreur suppression vidéo', err)
      });
    }
  }

  onAdd() {
    this.router.navigate(['/admin/videos/new']);
  }
}
