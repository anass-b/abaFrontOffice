import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../services/safeUrlPipe';

import { BaselineContentService } from '../../../services/baseline-content/baseline-content.service';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { EvaluationCriteriaService } from '../../../services/evaluation-criteria/evaluation-criteria.service';

import { BaselineContent } from '../../../models/baseline-content.model';
import { AbllsTask } from '../../../models/ablls-task.model';
import { EvaluationCriteria } from '../../../models/evaluation-criteria.model';

@Component({
  selector: 'app-baseline-content-viewer',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './baseline-content-viewer.component.html',
  styleUrls: ['./baseline-content-viewer.component.scss'],
})
export class BaselineContentViewerComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private baselineService = inject(BaselineContentService);
  private taskService = inject(AbllsTaskService);
  private criteriaService = inject(EvaluationCriteriaService);

  // Single baseline OR list
  item: BaselineContent | null = null;
  items: BaselineContent[] = [];

  // labels
  taskLabel: string | null = null;
  criteriaLabel: string | null = null;

  // file preview
  blobUrl: string | null = null;
  pdfViewerUrl: string | null = null;
  isPdf = false;
  isImage = false;

  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error = 'ID invalide'; this.loading = false; return; }

    document.addEventListener('contextmenu', this.prevent);
    document.addEventListener('keydown', this.blockShortcuts);

    const path = this.route.snapshot.routeConfig?.path ?? '';
    if (path.startsWith('baseline/task')) {
      // multiple baselines
      this.fetchByTaskId(id);
    } else {
      // single baseline
      this.fetchById(id);
    }
  }

  private fetchById(id: number) {
    this.baselineService.fetchById(id).subscribe({
      next: (meta) => {
        this.item = meta;
        this.resolveLabels(meta);

        this.baselineService.streamById(id).subscribe(blob => this.handleBlob(blob));
      },
      error: () => {
        this.loading = false;
        this.error = 'Contenu introuvable';
      }
    });
  }

private fetchByTaskId(taskId: number) {
  this.baselineService.fetchByTaskId(taskId).subscribe({
    next: (data) => {
      this.items = data || [];
      this.loading = false;

      if (this.items.length > 0) {
        this.item = this.items[0]; // show first by default
        this.resolveLabels(this.item);

        // 🔥 fetch file for this first baseline
        this.baselineService.streamById(this.item.id!).subscribe(blob => this.handleBlob(blob));
      }
    },
    error: () => {
      this.loading = false;
      this.error = 'Aucun contenu pour cette tâche';
    }
  });
}


  /** Resolve task code-title and criterion label from ids */
  private resolveLabels(meta: BaselineContent | null) {
    if (!meta?.abllsTaskId) return;

    this.taskService.fetchTasks().subscribe((tasks: AbllsTask[]) => {
      const task = tasks.find(t => t.id === meta.abllsTaskId);
      if (task) {
        this.taskLabel = `${task.code ?? ''}${task.code ? ' - ' : ''}${task.title ?? ''}`.trim();

        this.criteriaService.fetchByTaskId(task.id!).subscribe((critList: EvaluationCriteria[]) => {
          critList.forEach((c, idx) => (c as any).indexInTask = idx + 1);

          const crit = critList.find(c => c.id === meta.criteriaId);
          if (crit) {
            const idx = (crit as any).indexInTask;
            this.criteriaLabel = `${crit.label ?? 'Critère'} #${idx}`;
          }
        });
      }
    });
  }

  private handleBlob(blob: Blob) {
    this.loading = false;
    if (!(blob instanceof Blob)) {
      this.error = 'Impossible de charger le fichier';
      return;
    }

    const mime = blob.type?.toLowerCase() || '';
    this.isPdf = mime.includes('pdf');
    this.isImage = mime.startsWith('image/');

    this.blobUrl = URL.createObjectURL(blob);
    if (this.isPdf) {
      this.pdfViewerUrl = `assets/pdfjs/web/viewer.html?file=${encodeURIComponent(this.blobUrl)}`;
    }
  }

  prevent = (e: Event) => e.preventDefault();
  blockShortcuts = (e: KeyboardEvent) => {
    if (e.ctrlKey && ['s','p','u'].includes(e.key.toLowerCase())) e.preventDefault();
  };

  goBack(): void { this.router.navigate(['/ablls']); }

  ngOnDestroy(): void {
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
    document.removeEventListener('contextmenu', this.prevent);
    document.removeEventListener('keydown', this.blockShortcuts);
  }
}
