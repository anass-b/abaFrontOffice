import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { AbllsTask } from '../../../models/ablls-task.model';
import { environment } from '../../../../environments/environments';
import {inject} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { BaselineContentService } from '../../../services/baseline-content/baseline-content.service';
import { BaselineContent } from '../../../models/baseline-content.model';

@Component({
  selector: 'app-ablls-task-details',
  templateUrl: './ablls-task-details.component.html',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, RouterModule],
  styleUrls: []
})
export class AbllsTaskDetailsComponent implements OnInit {
  task: AbllsTask | null = null;
  selectedCategory: string | null = null;
  selectedDomain: string | null = null;
   baselines: BaselineContent[] = []; 

  baseUrl = environment.fileBaseUrl;
  route = inject(ActivatedRoute);
  taskService = inject(AbllsTaskService);
  baselineService = inject(BaselineContentService); 
  sanitizer = inject(DomSanitizer);

  
 ngOnInit(): void {
  const taskId = Number(this.route.snapshot.paramMap.get('id'));
  if (taskId) {
    this.taskService.fetchTaskById(taskId).subscribe({
      next: (data) => (this.task = data),
      error: (err) => console.error('Erreur chargement tâche', err)
    });
    this.baselineService.fetchByTaskId(taskId).subscribe({
        next: (data) => (this.baselines = data || []),
        error: (err) => console.error('Erreur chargement baselines', err)
      });
  }

  // 👉 Extraire les paramètres pour retour intelligent
  this.selectedCategory = this.route.snapshot.queryParamMap.get('category');
  this.selectedDomain = this.route.snapshot.queryParamMap.get('domain');
}


  getSafeUrl(url: string): SafeResourceUrl {
  const videoId = this.extractYoutubeId(url);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
}

private extractYoutubeId(url: string): string {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
}

}
