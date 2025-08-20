import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ResourceCategoryService } from '../../../services/resource-category/resource-category.service';
import { ResourceCategory } from '../../../models/resource-category.model';

@Component({
  selector: 'app-resource-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './resource-category-list.component.html',
  styleUrls: []
})
export class ResourceCategoryListComponent implements OnInit {
  private rcService = inject(ResourceCategoryService);
  private router = inject(Router);

  categories: ResourceCategory[] = [];
  searchTerm = '';
  loading = true;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.rcService.list().subscribe({
      next: (cats) => {
        this.categories = cats ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Erreur lors du chargement des catégories de ressources');
      }
    });
  }

  getFilteredCategories(): ResourceCategory[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.categories.filter(c =>
      (c.name ?? '').toLowerCase().includes(term) ||
      (c.description ?? '').toLowerCase().includes(term)
    );
  }

  onAdd(): void {
    this.router.navigate(['/admin/resource-categories/new']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/admin/resource-categories/edit', id]);
  }

  onDelete(id: number): void {
    if (!confirm('Confirmer la suppression de cette catégorie ?')) return;
    this.rcService.remove(id).subscribe({
      next: () => this.loadCategories(),
      error: () => alert('Erreur lors de la suppression')
    });
  }
}
