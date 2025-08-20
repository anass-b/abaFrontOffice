import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { AbllsTask } from '../../../models/ablls-task.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { DomainService } from '../../../services/domain/domain.service'; // <-- make sure you have this

@Component({
  selector: 'app-ablls-task-by-code',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ablls-task-by-code.component.html',
  styleUrls: ['./ablls-task-by-code.component.scss']
})
export class AbllsTaskByCodeComponent implements OnInit {
  abllsTaskService = inject(AbllsTaskService);
  domainService = inject(DomainService);
  router = inject(Router);
  auth = inject(AuthService);

  tasks: AbllsTask[] = [];
  groupedByDomain: { [domainName: string]: AbllsTask[] } = {};
  domainMap: { [domainName: string]: { name: string, prefix: string } } = {};
  search = '';
  selectedDomainName: string | null = null;
  domainNames: string[] = [];
  selectedChip: string = '';        // '' = Tous
  sortMode: 'az'|'za'|'more'|'less' = 'az';

  ngOnInit(): void {
    this.domainService.getAll().subscribe(domains => {
      this.domainMap = {};
      domains.forEach((d: any) => {
        this.domainMap[d.name] = { name: d.name, prefix: d.prefix };
      });
      this.domainNames = domains.map((d: any) => d.name);

      this.abllsTaskService.fetchTasks().subscribe(tasks => {
        this.tasks = tasks;
        this.groupByDomainName(tasks, domains);
        this.applySort();
      });
    });
  }
  selectChip(name: string) {
    this.selectedChip = name;              // dans la vue domaine, on masque/affiche par [hidden]
    // on peut aussi pousser le terme dans la recherche si tu préfères :
    // this.search = name || '';
  }

  /** tri des domaines dans le regroupement (affecte seulement l’ordre d’affichage) */
  applySort() {
    // rien à modifier dans les données; le keyvalue pipe + compareByPrefix gèrent l’ordre alpha.
    // On “restitue” un compare pour plus/moins de tâches si besoin :
    if (this.sortMode === 'more' || this.sortMode === 'less') {
      this.compareByPrefix = (a: any, b: any) => {
        const la = (a.value?.length || 0);
        const lb = (b.value?.length || 0);
        return this.sortMode === 'more' ? (lb - la) : (la - lb);
      };
    } else if (this.sortMode === 'az' || this.sortMode === 'za') {
      this.compareByPrefix = (a: any, b: any) => {
        const A = this.domainMap[a.key]?.prefix ?? a.key ?? '';
        const B = this.domainMap[b.key]?.prefix ?? b.key ?? '';
        const r = A.localeCompare(B);
        return this.sortMode === 'az' ? r : -r;
      };
    }
  }

  resetAll() {
    this.search = '';
    this.selectedChip = '';
    this.sortMode = 'az';
    this.applySort();
  }
  viewBaseline(id: number | undefined): void {
  if (!id) return;
  this.router.navigate(['/baseline/task', id]);   // 🔥 always use this one
}


  // navigation “Lignes de base” (adapte la route si besoin)
  onOpenBaseline(task: AbllsTask) {
    this.router.navigate(['/baselines'], { queryParams: { taskId: task.id } });
  }

  groupByDomainName(tasks: AbllsTask[], allDomains: any[]): void {
    const grouped: { [domainName: string]: AbllsTask[] } = {};

    // Initialize all domains with empty arrays
    allDomains.forEach(domain => {
      grouped[domain.name] = [];
    });

    // Fill with tasks
    tasks.forEach(task => {
      const domainName = task.domain?.name ?? 'Domaine inconnu';
      if (!grouped[domainName]) grouped[domainName] = [];
      grouped[domainName].push(task);
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

  compareByPrefix = (a: any, b: any): number => {
    const prefixA = this.domainMap[a.key]?.prefix ?? '';
    const prefixB = this.domainMap[b.key]?.prefix ?? '';
    return prefixA.localeCompare(prefixB);
  };

  getFilteredTasks(domainName: string): AbllsTask[] {
    const term = this.search.toLowerCase();
    return this.groupedByDomain[domainName]
      .filter(task =>
        task.code?.toLowerCase().includes(term) ||
        task.title?.toLowerCase().includes(term)
      )
      .sort((a, b) => this.naturalSort(a.code, b.code));
  }

  naturalSort(a: string = '', b: string = ''): number {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  }

  onAdd(): void {
    this.router.navigate(['/domaines/new']);
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
onEdit(task: AbllsTask): void {
  if (!task) return;
  this.router.navigate(['/admin/ablls/new'], {
    state: {
      updateMode: true,
      task
    }
  });
}


onDelete(task: AbllsTask): void {
  if (!task?.id) return;

  const label = `${task.code ?? ''} - ${task.title ?? ''}`.trim();
  const ok = confirm(`Confirmer la suppression de : ${label} ?`);
  if (!ok) return;

  this.abllsTaskService.deleteTask(task.id).subscribe({
    next: () => {
      // Retirer de la liste plate
      this.tasks = this.tasks.filter(t => t.id !== task.id);

      // Retirer du regroupement par domaine
      const domainName = task.domain?.name ?? 'Domaine inconnu';
      if (this.groupedByDomain[domainName]) {
        this.groupedByDomain[domainName] =
          this.groupedByDomain[domainName].filter(t => t.id !== task.id);

        // Optionnel : si tu veux masquer le domaine quand il devient vide
        // if (this.groupedByDomain[domainName].length === 0) {
        //   delete this.groupedByDomain[domainName];
        // }
      }
    },
    error: () => {
      alert("La suppression a échoué. Réessaie plus tard.");
    }
  });
}

}
