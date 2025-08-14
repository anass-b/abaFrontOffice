import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule , Router } from '@angular/router';
import { BaselineContentService } from '../../../services/baseline-content/baseline-content.service';
import { BaselineContent } from '../../../models/baseline-content.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-baseline-content-list',
  standalone: true,
  imports: [CommonModule, RouterModule , FormsModule],
  templateUrl: './baseline-content-list.component.html',
  styleUrls: []
})
export class BaselineContentListComponent implements OnInit {
  baselineContents: BaselineContent[] = [];
  search = '';
  baselineService = inject(BaselineContentService);
  router = inject(Router);

  ngOnInit(): void {
    this.loadBaselineContents();
  }

  loadBaselineContents() {
    this.baselineService.fetchAll().subscribe({
      next: data => this.baselineContents = data,
      error: err => console.error('Erreur chargement des contenus', err)
    });
  }
   getFilteredBaselineContents(): BaselineContent[] {
    const term = this.search.toLowerCase().trim();
    return this.baselineContents.filter(item =>
      item.abllsTaskId?.toString().includes(term) ||
      item.criteriaId?.toString().includes(term) ||
      item.contentHtml?.toLowerCase().includes(term)
    );
  }

  onAdd(): void {
    this.router.navigate(['/baseline/new']);
  }

  editBaseline(id: number | undefined): void {
    this.router.navigate(['/ablls/edit-baseline', id]);
  }

  deleteBaseline(id: number | undefined): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      this.baselineService.delete(id).subscribe({
        next: () => this.loadBaselineContents(),
        error: err => console.error('Erreur suppression', err)
      });
    }
  }
}
