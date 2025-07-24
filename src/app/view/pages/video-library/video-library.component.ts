import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService} from '../../../services/video/video.service';
import { Video } from '../../../models/video.model';
import { FormsModule } from '@angular/forms';
import { RouterLink , Router} from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-video-library',
  standalone: true,
  imports: [CommonModule , FormsModule, RouterLink],
  templateUrl: './video-library.component.html',
  styleUrls: ['./video-library.component.scss']
})
export class VideoLibraryComponent {
  videoService = inject(VideoService);
  router = inject(Router);
  sharedService = inject(SharedService);
  auth = inject(AuthService);

  videos: Video[] = [];
  categories: string[] = ['Principes ABA', 'Techniques d’Enseignement', 'Interventions Spécifiques'];
  selectedCategory: string = '';
  searchTerm = '';
  loading = true;
  selectedVideoId: number | null | undefined = null;
  videoUrl: string | null = null;



  ngOnInit() {
    this.fetchVideos();
  }

  fetchVideos() {
  this.loading = true;
  this.videoService.fetchVideos().subscribe({
    next: (data) => {
     this.videos = data
  .map(video => ({
    ...video,
    thumbnailUrl: `https://ababackoffice.onrender.com${video.thumbnailUrl}`,
    url: video.useExternal ? video.url : `https://ababackoffice.onrender.com${video.url}`
  }))
  .filter(video =>
    this.auth.isAdmin ||
    this.auth.isOwner({ createdBy: video.createdBy! }) ||
   this.auth.hasAccessToContent({
      isPremium: video.isPremium ?? false,
      createdBy: video.createdBy!
    })
  );

      this.loading = false;
    },
    error: () => {
      alert("Erreur lors du chargement des vidéos");
      this.loading = false;
    }
  });
}
canAccess(video: Video): boolean {
  return this.auth.hasAccessToContent({
    isPremium: video.isPremium ?? false,
    createdBy: video.createdBy!
  });
}


  playVideo(videoId: number | undefined) {
  this.selectedVideoId = videoId;
  this.videoService.streamVideoById(videoId).subscribe(blob => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      this.videoUrl = url;
    } else {
      this.videoUrl = null;
    }
  });
}
openVideoInNewTab(videoId: number | undefined): void {
  const video = this.videos.find(v => v.id === videoId);
  if (!video) return;

  if (video.useExternal && video.url) {
    // 🌐 Cas 1 : vidéo en ligne (YouTube, Vimeo, etc.)
    window.open(video.url, '_blank');
  } else {
    // 📁 Cas 2 : vidéo locale (stockée sur le serveur)
    this.videoService.streamVideoById(videoId).subscribe(blob => {
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000); // nettoyage mémoire
      } else {
        //this.sharedService.showErrorMessage('Impossible de lire la vidéo.');
      }
    });
  }
}



  editVideo(video: Video) {
    this.router.navigate(['/videos/edit', video.id]);
  }

  deleteVideo(video: Video) {
    if (confirm(`Supprimer la vidéo "${video.title}" ?`)) {
      this.videoService.deleteVideo(video.id).subscribe(() => {
        this.fetchVideos(); // Recharge la liste
      });
    }
  }


  filteredVideos(): Video[] {
    return this.videos.filter(video =>
      (this.selectedCategory === '' || video.category === this.selectedCategory) &&
      (video.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '')
    );
  }

  selectCategory(category: string) {
    this.selectedCategory = category === this.selectedCategory ? '' : category;
  }

  formatDuration(minutes: number | undefined): string {
    if (!minutes) return '';
    const min = Math.floor(minutes);
    const sec = Math.round((minutes - min) * 60);
    return `${min} min${sec > 0 ? ` ${sec} sec` : ''}`;
  }
}
