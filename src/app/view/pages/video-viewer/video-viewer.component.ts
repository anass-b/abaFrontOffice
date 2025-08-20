import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { VideoService } from '../../../services/video/video.service';
import { Video } from '../../../models/video.model';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-video-viewer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-viewer.component.html',
  styleUrls: ['./video-viewer.component.scss']
})
export class VideoViewerComponent implements OnInit, OnDestroy {
  private videoService = inject(VideoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  video: Video | null = null;
  videoBlobUrl: string | null = null;
  playerSafeUrl: SafeResourceUrl | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.goBack();
      return;
    }

    this.videoService.fetchVideoById(id).subscribe(video => {
      // Make sure we got a proper Video
      if (!video || typeof (video as Video).useExternal === 'undefined') {
        this.video = null;
        return;
      }

      this.video = video as Video;

      if (this.video.useExternal) {
        // Build absolute backend player URL (e.g., http://host:5000/api/video/player/1)
        const base = environment.apiUrl.replace(/\/+$/, ''); // trim trailing slash
        const url = `${base}/video/player/${id}`;
        this.playerSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        // Local/proxy blob playback
        this.videoService.streamVideoById(this.video.id).subscribe(blob => {
          if (blob) this.videoBlobUrl = URL.createObjectURL(blob);
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.videoBlobUrl) URL.revokeObjectURL(this.videoBlobUrl);
  }

  goBack(): void {
    this.router.navigate(['/videos']);
  }
}
