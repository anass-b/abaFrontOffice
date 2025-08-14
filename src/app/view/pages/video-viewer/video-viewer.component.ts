import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video/video.service';
import { Video } from '../../../models/video.model';
import { SafeUrlPipe } from '../../../services/safeUrlPipe';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-video-viewer',
  standalone: true,
  imports: [CommonModule, RouterLink , SafeUrlPipe],
  templateUrl: './video-viewer.component.html',
  styleUrls: ['./video-viewer.component.scss']
})
export class VideoViewerComponent implements OnInit {
  videoService = inject(VideoService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  Url : string | undefined = `${environment.apiUrl}/video/stream/`

  video: Video | null = null;
  videoBlobUrl: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.videoService.fetchVideoById(id).subscribe(video => {
      // Type guard to ensure video is of type Video
      if (video && typeof (video as Video).useExternal !== 'undefined') {
        this.video = video as Video;

        if (!this.video.useExternal) {
            this.videoService.streamVideoById(this.video.id).subscribe(blob => {
            if (blob) {
              this.videoBlobUrl = URL.createObjectURL(blob);
            } else {
              this.videoBlobUrl = null;
            }
          });
        }
      } else {
        this.video = null;
      }
    });
  }

  

  goBack(): void {
    this.router.navigate(['/videos']);
  }
}
