import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { AbllsTask } from '../../../models/ablls-task.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

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

  tasks: AbllsTask[] = [];
  groupedTasks: { [domain: string]: AbllsTask[] } = {};
  search = '';
  selectedDomain: string | null = null;

  isAdmin$ = this.auth.isAdmin$;

  ngOnInit(): void {
    this.abllsTaskService.fetchTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.groupTasks(tasks);
    });
  }

  groupTasks(tasks: AbllsTask[]): void {
    const grouped: { [domain: string]: AbllsTask[] } = {};
    tasks.forEach(task => {
      const domain = task.domain || 'Autre';
      if (!grouped[domain]) grouped[domain] = [];
      grouped[domain].push(task);
    });
    this.groupedTasks = grouped;
  }

  selectDomain(domain: string): void {
    this.selectedDomain = domain;
  }

  clearDomain(): void {
    this.selectedDomain = null;
  }

  goToDetail(id: number): void {
    this.router.navigate(['/ablls-task', id]);
  }

  /** 🔍 Filtrer les tâches dans un domaine */
  getFilteredTasks(domain: string): AbllsTask[] {
    const term = this.search.toLowerCase();
    return this.groupedTasks[domain].filter(task =>
      task.title?.toLowerCase().includes(term) ||
      task.domain?.toLowerCase().includes(term) ||
      task.reference?.toLowerCase().includes(term)
    );
  }

  /** 🔍 Filtrer les domaines en fonction de la recherche */
  getFilteredDomains(): { [domain: string]: AbllsTask[] } {
    if (!this.search.trim()) return this.groupedTasks;

    const term = this.search.toLowerCase();
    const filtered: { [domain: string]: AbllsTask[] } = {};

    for (const domain in this.groupedTasks) {
      const tasks = this.groupedTasks[domain];

      // Match domaine ou une tâche du domaine
      const domainMatch = domain.toLowerCase().includes(term);
      const taskMatch = tasks.some(task =>
        task.title?.toLowerCase().includes(term) ||
        task.reference?.toLowerCase().includes(term)
      );

      if (domainMatch || taskMatch) {
        filtered[domain] = tasks;
      }
    }

    return filtered;
  }
}

