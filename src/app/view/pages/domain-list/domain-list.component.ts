import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DomainService } from '../../../services/domain/domain.service';
import { CategoryService } from '../../../services/category/category.service';

import { Domain } from '../../../models/domain.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-domain-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './domain-list.component.html',
  styleUrls: []
})
export class DomainListComponent implements OnInit {
  private domainService = inject(DomainService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  domains: Domain[] = [];
  categories: Category[] = [];

  // maps
  categoryMap: Record<number, string> = {};

  // UI state
  searchTerm = '';
  selectedCategoryId: number | null = null;

  ngOnInit(): void {
    // charge catégories puis domaines (pour la map et le filtre)
    this.categoryService.getAll().subscribe({
      next: cats => {
        this.categories = cats || [];
        this.categories.forEach(c => (this.categoryMap[c.id] = c.name));

        this.loadDomains();
      },
      error: err => console.error('Erreur chargement catégories', err)
    });
  }

  private loadDomains(): void {
    this.domainService.getAll().subscribe({
      next: doms => {
        // tri par catégorie (nom), puis par prefix, puis par nom
        this.domains = (doms || []).sort((a, b) => {
          const catA = (this.categoryMap[a.categoryId] || '').toLowerCase();
          const catB = (this.categoryMap[b.categoryId] || '').toLowerCase();
          if (catA !== catB) return catA.localeCompare(catB, 'fr');
          const px = (a.prefix || '').localeCompare(b.prefix || '', 'fr', { numeric: true });
          if (px !== 0) return px;
          return (a.name || '').localeCompare(b.name || '', 'fr', { numeric: true });
        });
      },
      error: err => console.error('Erreur chargement domaines', err)
    });
  }

  getFilteredDomains(): Domain[] {
    const q = this.normalize(this.searchTerm);

    return this.domains.filter(d => {
      // filtre par catégorie
      if (this.selectedCategoryId != null && d.categoryId !== this.selectedCategoryId) {
        return false;
      }
      // filtre texte (nom / prefix / nom de catégorie)
      const name = this.normalize(d.name);
      const prefix = this.normalize(d.prefix);
      const catName = this.normalize(this.categoryMap[d.categoryId] || '');
      return (
        (q ? (name.includes(q) || prefix.startsWith(q) || catName.includes(q)) : true)
      );
    });
  }

  onEdit(id: number): void {
  const dom = this.domains.find(d => d.id === id);
  if (!dom) return;

  this.router.navigate(['/admin/domains/new'], {
    state: {
      updateMode: true,
      domain: dom
    }
  });
}


  onDelete(id: number) {
    if (confirm('Confirmer la suppression de ce domaine ?')) {
      this.domainService.delete(id).subscribe({
        next: () => this.loadDomains(),
        error: err => console.error('Erreur suppression domaine', err)
      });
    }
  }

  onAdd() {
    this.router.navigate(['/admin/domains/new']);
  }

  private normalize(v?: string | null): string {
    return (v || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
