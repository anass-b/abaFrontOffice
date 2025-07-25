import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AbllsTask } from '../../../models/ablls-task.model';
import { AbllsVideo } from '../../../models/ablls-video.model';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { AbllsVideoService } from '../../../services/ablls-video/ablls-video.service';

@Component({
  selector: 'app-ablls-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ablls-task-details.component.html',
  styleUrls: ['./ablls-task-details.component.scss']
})
export class AbllsTaskDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  taskService = inject(AbllsTaskService);
  videoService = inject(AbllsVideoService);

  taskId!: number;
  task: AbllsTask | null = null;
  allVideos: AbllsVideo[] = [];

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData(): void {
    this.taskService.fetchTaskById(this.taskId).subscribe(task => (this.task = task));
    this.videoService.fetchVideos().subscribe(videos => {
      this.allVideos = videos.filter(v => v.taskId === this.taskId);
    });
  }

  get evaluationVideo(): AbllsVideo | undefined {
    return this.allVideos.find(v => v.type?.toLowerCase() === 'évaluation');
  }

  get complementaryVideos(): AbllsVideo[] {
    return this.allVideos.filter(v => v.type?.toLowerCase() === 'complémentaire');
  }

  get criteriaVideos(): AbllsVideo[] {
    return this.allVideos
      .filter(v => v.type?.toLowerCase()?.startsWith('critère'))
      .slice(0, 4);
  }
}
