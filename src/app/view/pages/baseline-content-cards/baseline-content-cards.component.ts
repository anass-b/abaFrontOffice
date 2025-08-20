import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaselineContentService } from '../../../services/baseline-content/baseline-content.service';
import { BaselineContent } from '../../../models/baseline-content.model';
import { AuthService } from '../../../services/auth/auth.service';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { EvaluationCriteriaService } from '../../../services/evaluation-criteria/evaluation-criteria.service';
import { AbllsTask } from '../../../models/ablls-task.model';
import { EvaluationCriteria } from '../../../models/evaluation-criteria.model';

@Component({
  selector: 'app-baseline-content-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './baseline-content-cards.component.html',
  styleUrls: ['./baseline-content-cards.component.scss']
})
export class BaselineContentCardsComponent implements OnInit {
  private baselineService = inject(BaselineContentService);
  private taskService = inject(AbllsTaskService);
  private criteriaService = inject(EvaluationCriteriaService);

  router = inject(Router);
  auth = inject(AuthService);

  baselineContents: (BaselineContent & {
    taskLabel?: string;
    criteriaLabel?: string;
  })[] = [];

  search = '';
  isLoading = true;

  ngOnInit(): void {
    this.loadBaselineContents();
  }

  loadBaselineContents() {
    this.isLoading = true;
    this.baselineService.fetchAll().subscribe({
      next: data => {
        this.baselineContents = data;

        // resolve task + criteria labels for each item
        this.baselineContents.forEach(item => this.resolveLabels(item));

        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur chargement des contenus', err);
        this.isLoading = false;
      }
    });
  }

  /** Reuse viewer logic to enrich labels */
  private resolveLabels(meta: BaselineContent) {
    if (!meta?.abllsTaskId) return;

    this.taskService.fetchTasks().subscribe((tasks: AbllsTask[]) => {
      const task = tasks.find(t => t.id === meta.abllsTaskId);
      if (task) {
        meta.taskLabel = `${task.code ?? ''}${task.code ? ' - ' : ''}${task.title ?? ''}`.trim();

        this.criteriaService.fetchByTaskId(task.id!).subscribe((critList: EvaluationCriteria[]) => {
          critList.forEach((c, idx) => (c as any).indexInTask = idx + 1);

          const crit = critList.find(c => c.id === meta.criteriaId);
          if (crit) {
            const idx = (crit as any).indexInTask;
            meta.criteriaLabel = `${crit.label ?? 'Critère'} #${idx}`;
          }
        });
      }
    });
  }

  getFilteredBaselineContents(): BaselineContent[] {
    const term = this.search.toLowerCase().trim();
    return this.baselineContents.filter(item =>
      item.taskLabel?.toLowerCase().includes(term) ||
      item.criteriaLabel?.toLowerCase().includes(term) ||
      item.contentHtml?.toLowerCase().includes(term)
    );
  }

  goToViewer(id?: number): void {
    if (!id) return;
    this.router.navigate(['/baseline/view', id]);
  }
  viewBaseline(id: number | undefined): void {
  if (!id) return;
  this.router.navigate(['/baseline/view', id]);
}

  editBaseline(id?: number): void {
    if (!id) return;
    this.router.navigate(['/ablls/edit-baseline', id]);
  }

  deleteBaseline(id?: number): void {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      this.baselineService.delete(id).subscribe({
        next: () => this.loadBaselineContents(),
        error: err => console.error('Erreur suppression', err)
      });
    }
  }
}
