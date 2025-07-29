import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { AbllsTask } from '../../../models/ablls-task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ablls-task-by-code',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ablls-task-by-code.component.html',
  styleUrls: []
})
export class AbllsTaskByCodeComponent implements OnInit {
  abllsTaskService = inject(AbllsTaskService);
  router = inject(Router);

  tasks: AbllsTask[] = [];
  groupedByCode: { [prefix: string]: AbllsTask[] } = {};
  search = '';
  selectedPrefix: string | null = null;

  ngOnInit(): void {
    this.abllsTaskService.fetchTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.groupByCodePrefix(tasks);
    });
  }

  groupByCodePrefix(tasks: AbllsTask[]): void {
    const grouped: { [prefix: string]: AbllsTask[] } = {};
    tasks.forEach(task => {
      const code = task.code || 'Inconnu';
      const prefix = code.charAt(0).toUpperCase();
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(task);
    });
    this.groupedByCode = grouped;
  }

  selectPrefix(prefix: string): void {
    this.selectedPrefix = prefix;
  }

  clearPrefix(): void {
    this.selectedPrefix = null;
  }

  goToDetail(id: number): void {
    this.router.navigate(['/ablls-task', id]);
  }

  getFilteredTasks(prefix: string): AbllsTask[] {
    const term = this.search.toLowerCase();
    return this.groupedByCode[prefix].filter(task =>
      task.code?.toLowerCase().includes(term) ||
      task.title?.toLowerCase().includes(term)
    );
  }

  getFilteredPrefixes(): { [prefix: string]: AbllsTask[] } {
    if (!this.search.trim()) return this.groupedByCode;

    const term = this.search.toLowerCase();
    const filtered: { [prefix: string]: AbllsTask[] } = {};

    for (const prefix in this.groupedByCode) {
      const tasks = this.groupedByCode[prefix];
      const prefixMatch = prefix.toLowerCase().includes(term);
      const taskMatch = tasks.some(task =>
        task.code?.toLowerCase().includes(term) ||
        task.title?.toLowerCase().includes(term)
      );

      if (prefixMatch || taskMatch) {
        filtered[prefix] = tasks;
      }
    }

    return filtered;
  }
}
