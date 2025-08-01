import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { AbllsTask } from '../../../models/ablls-task.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CategoryService } from '../../../services/category/category.service';
import { Domain } from '../../../models/domain.model';

@Component({
  selector: 'app-ablls-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ablls-task-list.component.html',
  styleUrls: ['./ablls-task-list.component.scss']
})
export class AbllsTaskListComponent implements OnInit {
  abllsTaskService = inject(AbllsTaskService);
  router = inject(Router);
  auth = inject(AuthService);
  categoryService = inject(CategoryService);

  tasks: AbllsTask[] = [];
  groupedByCategory: { [categoryName: string]: { [domainName: string]: AbllsTask[] } } = {};
  categoryMap: { [id: number]: string } = {};
  domainMap: { [domainName: string]: Domain } = {};
  search = '';
  selectedCategory: string | null = null;
  selectedDomain: string | null = null;

  ngOnInit(): void {
    this.abllsTaskService.fetchTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.loadCategories(tasks);
    });
  }

  private loadCategories(tasks: AbllsTask[]) {
    const categoryIds = new Set<number>();
    tasks.forEach(task => {
      if (task.domain?.categoryId) {
        categoryIds.add(task.domain.categoryId);
      }
    });

    const idsArray = Array.from(categoryIds);
    idsArray.forEach(id => {
      this.categoryService.getById(id).subscribe(cat => {
        this.categoryMap[id] = cat?.name ?? 'Catégorie inconnue';
        this.groupTasks(this.tasks); // regroup once we start having names
      });
    });
  }

  groupTasks(tasks: AbllsTask[]): void {
    const result: any = {};

    tasks.forEach(task => {
      const domain = task.domain;
      const catId = domain?.categoryId;
      const categoryName = this.categoryMap[catId!] || 'Autre catégorie';
      const domainName = domain?.name ?? 'Domaine inconnu';

      if (!result[categoryName]) {
        result[categoryName] = {};
      }
      if (!result[categoryName][domainName]) {
        result[categoryName][domainName] = [];
      }
      if (domain?.name) {
        this.domainMap[domain.name] = domain;
      }

      result[categoryName][domainName].push(task);
    });

    this.groupedByCategory = result;
  }

  getFilteredCategories(): string[] {
    const term = this.search.toLowerCase();
    return Object.keys(this.groupedByCategory).filter(cat =>
      cat.toLowerCase().includes(term) ||
      Object.keys(this.groupedByCategory[cat]).some(domain =>
        domain.toLowerCase().includes(term)
      )
    );
  }

  getTotalTasksInCategory(category: string): number {
    return Object.values(this.groupedByCategory[category])
      .reduce((sum, tasks) => sum + tasks.length, 0);
  }

  getDomainsForCategory(category: string): string[] {
    return Object.keys(this.groupedByCategory[category]);
  }

  getTasksForDomain(category: string, domain: string): AbllsTask[] {
    return this.groupedByCategory[category][domain];
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  selectDomain(domain: string) {
    this.selectedDomain = domain;
  }

  clearCategory() {
    this.selectedCategory = null;
    this.selectedDomain = null;
  }

  clearDomain() {
    this.selectedDomain = null;
  }

  goToDetail(id: number): void {
    this.router.navigate(['/ablls-task', id]);
  }
}
