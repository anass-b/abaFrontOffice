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
  groupedByDomain: { [domainName: string]: AbllsTask[] } = {};
  domainMap: { [domainName: string]: { name: string, prefix: string } } = {};
  search = '';
  selectedDomainName: string | null = null;

  ngOnInit(): void {
    this.abllsTaskService.fetchTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.groupByDomainName(tasks);
    });
  }

  groupByDomainName(tasks: AbllsTask[]): void {
    const grouped: { [domainName: string]: AbllsTask[] } = {};
    this.domainMap = {};

    tasks.forEach(task => {
      const domainName = task.domain?.name ?? 'Domaine inconnu';
      if (!grouped[domainName]) grouped[domainName] = [];
      grouped[domainName].push(task);

      if (task.domain) {
        this.domainMap[domainName] = {
          name: task.domain.name,
          prefix: task.domain.prefix
        };
      }
    });

    this.groupedByDomain = grouped;
  }

  getFilteredDomains(): { [domainName: string]: AbllsTask[] } {
    if (!this.search.trim()) return this.groupedByDomain;

    const term = this.search.toLowerCase();
    const filtered: { [domainName: string]: AbllsTask[] } = {};

    for (const domain in this.groupedByDomain) {
      const tasks = this.groupedByDomain[domain];
      const domainMatch = domain.toLowerCase().includes(term);
      const taskMatch = tasks.some(task =>
        task.code?.toLowerCase().includes(term) ||
        task.title?.toLowerCase().includes(term)
      );

      if (domainMatch || taskMatch) {
        filtered[domain] = tasks;
      }
    }

    return filtered;
  }

  getFilteredTasks(domainName: string): AbllsTask[] {
    const term = this.search.toLowerCase();
    return this.groupedByDomain[domainName].filter(task =>
      task.code?.toLowerCase().includes(term) ||
      task.title?.toLowerCase().includes(term)
    );
  }

  selectDomain(domainName: string): void {
    this.selectedDomainName = domainName;
  }

  clearDomain(): void {
    this.selectedDomainName = null;
  }

  goToDetail(id: number): void {
    this.router.navigate(['/ablls-task', id]);
  }
}
