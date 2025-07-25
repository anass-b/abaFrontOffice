import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService } from '../../../../services/video/video.service';
import { Video } from '../../../../models/video.model';

@Component({
  selector: 'app-admin-videos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-videos.component.html',
  styleUrls: ['./admin-videos.component.scss']
})
export class AdminVideosComponent implements OnInit {
  videoService = inject(VideoService);
  videos: Video[] = [];

  ngOnInit() {
    this.fetchVideos();
  }

  fetchVideos() {
    this.videoService.fetchVideos().subscribe(data => {
      this.videos = data;
    });
  }

  deleteVideo(id: number | undefined) {
    if (confirm('Supprimer cette vidéo ?')) {
      this.videoService.deleteVideo(id).subscribe(() => this.fetchVideos());
    }
  }
}
