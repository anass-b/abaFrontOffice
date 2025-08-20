import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category.model';
import { FormsModule } from '@angular/forms';
import { Domain } from '../../../models/domain.model';
import { DomainService } from '../../../services/domain/domain.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule , FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: []
})
export class CategoryListComponent implements OnInit {
  categoryService = inject(CategoryService);
  domainService = inject(DomainService);
  router = inject(Router);
  categories: Category[] = [];
  domains: Domain[] = [];
  searchTerm = '';

  ngOnInit(): void {
  this.categoryService.getAll().subscribe({
    next: (cats) => {
      this.categories = cats;
      this.domainService.getAll().subscribe({
        next: (doms) => {
          this.domains = doms;

          // 🧠 Inject domains into each category
          this.categories.forEach(cat => {
            cat.domains = this.domains.filter(d => d.categoryId === cat.id);
          });
        }
      });
    }
  });
}

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  getFilteredCategories(): Category[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.categories.filter(cat => cat.name.toLowerCase().includes(term));
  }

  onEdit(id: number) {
  const category = this.categories.find(c => c.id === id);
  if (!category) return;

  this.router.navigate(['/admin/category/new'], {
    state: {
      updateMode: true,
      category
    }
  });
}


  onDelete(id: number) {
    if (confirm('Confirmer la suppression de cette catégorie ?')) {
      this.categoryService.delete(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  onAdd() {
    this.router.navigate(['/admin/category/new']);
  }
}
