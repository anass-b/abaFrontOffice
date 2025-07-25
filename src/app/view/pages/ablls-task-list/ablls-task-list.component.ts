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
  filteredTasks: AbllsTask[] = [];
  search = '';
  isAdmin$ = this.auth.isAdmin$;

  ngOnInit(): void {
    this.abllsTaskService.fetchTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
    });
  }

  filterTasks(): void {
    const term = this.search.toLowerCase();
    this.filteredTasks = this.tasks.filter(task =>
      task.title?.toLowerCase().includes(term) ||
      task.domain?.toLowerCase().includes(term) ||
      task.reference?.toLowerCase().includes(term)
    );
  }

  goToDetail(id: number): void {
    this.router.navigate(['/ablls-task', id]);
  }
}
