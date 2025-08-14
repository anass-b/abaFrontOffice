import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EvaluationCriteriaService } from '../../../services/evaluation-criteria/evaluation-criteria.service';
import { MaterialPhotoService } from '../../../services/material-photo/material-photo.service';
import { environment } from '../../../../environments/environments';
import { EvaluationCriteria } from '../../../models/evaluation-criteria.model';
import { MaterialPhoto } from '../../../models/material-photo.model';
import { NgIf, NgFor } from '@angular/common';
import { inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';


@Component({
  selector: 'app-evaluation-criteria-details',
  templateUrl: './evaluation-criteria-details.component.html',
  standalone: true,
  imports: [NgIf, NgFor , RouterLink],
  styleUrls: []
})
export class EvaluationCriteriaDetailsComponent implements OnInit {
  crit!: EvaluationCriteria;
  materials: MaterialPhoto[] = [];
  indexInTask: number | null = null;

  baseUrl = environment.fileBaseUrl;
  critService = inject(EvaluationCriteriaService);
  materialService = inject(MaterialPhotoService);
  sanitizer = inject(DomSanitizer);
  route = inject(ActivatedRoute);
  taskService = inject(AbllsTaskService);

  

  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  if (!id) return;

  this.critService.fetchById(id).subscribe({
    next: (data) => {
      this.crit = Array.isArray(data) ? data[0] : data;

      // 🧩 Charger les matériels associés
      if (this.crit?.materialPhotoIds?.length) {
        this.materialService.fetchAll().subscribe({
          next: (all) => {
            this.materials = all.filter(m => this.crit!.materialPhotoIds!.includes(m.id!));
          }
        });
      }

      // 🔢 Calculer l'index du critère dans sa tâche ABLLS
      if (this.crit?.abllsTaskId) {
        this.taskService.fetchTaskById(this.crit.abllsTaskId).subscribe({
          next: (task) => {
            this.crit.task = task;
            const criterias = task?.evaluationCriterias || [];
            const index = criterias.findIndex(c => c.id === this.crit?.id);
            if (index !== -1) {
              this.indexInTask = index + 1; // 1-based
            }
          }
        });
      }
    },
    error: (err) => console.error('Erreur chargement critère', err)
  });
}


  getSafeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYoutubeId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  private extractYoutubeId(url: string): string {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }
}
