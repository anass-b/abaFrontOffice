import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CategoryService } from '../../../services/category/category.service';
import { DomainService } from '../../../services/domain/domain.service';
import { AbllsTask } from '../../../models/ablls-task.model';
import { Category } from '../../../models/category.model';
import { Domain } from '../../../models/domain.model';
import { AbllsTaskEnriched } from '../../../models/ablls-task.model';
type MatchKind = 'code' | 'title' | 'domain' | 'category' | 'mixed' | null;

@Component({
  selector: 'app-ablls-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ablls-task-list.component.html',
  styleUrls: ['./ablls-task-list.component.scss']
})
export class AbllsTaskListComponent implements OnInit {
  // services
  private abllsTaskService = inject(AbllsTaskService);
  private router = inject(Router);
  public auth = inject(AuthService);
  private categoryService = inject(CategoryService);
  private domainService = inject(DomainService);

  // data
 tasks: AbllsTaskEnriched[] = [];
  filteredTasks: AbllsTaskEnriched[] = [];
  categories: Category[] = [];
  domains: Domain[] = [];

  // maps
  categoryMap: { [id: number]: string } = {};
  domainMapById: { [id: number]: Domain } = {};
  domainMapByName: { [name: string]: Domain } = {};

  // ui
  search = '';
  matchedBy: MatchKind = null;
  isReady = false;

  // pagination
  currentPage = 1;
  pageSize = 12;

  readonly matchedByLabel: Record<Exclude<MatchKind, null>, string> = {
    code: 'code',
    title: 'titre',
    domain: 'domaine',
    category: 'catégorie',
    mixed: 'recherche'
  };

  ngOnInit(): void {
    console.log("🔥 AbllsTaskListComponent initialized");

    Promise.all([
      this.categoryService.getAll().toPromise(),
      this.domainService.getAll().toPromise(),
      this.abllsTaskService.fetchTasks().toPromise()
    ])
      .then(([cats, doms, tasks]) => {
        this.categories = cats || [];
        this.domains = doms || [];
        this.tasks = tasks || [];

        // Build maps
        this.categories.forEach(cat => (this.categoryMap[cat.id] = cat.name?.trim() || ''));
        this.domains.forEach(dom => {
          this.domainMapById[dom.id] = dom;
          this.domainMapByName[dom.name] = dom;
        });

        // Enrich tasks with resolved ids/names and normalized fields ONCE
        const norm = (v?: string | null) =>
          (v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

   this.tasks = this.tasks.map(t => {
  const domObj = this.domainMapById[t.domainId] || t.domain;
  const domainName = domObj?.name?.trim() || '';
  const categoryName = this.categoryMap[domObj?.categoryId ?? -1] || '';

  const norm = (v?: string) =>
    (v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return {
    ...t,
    __domainName: domainName,
    __categoryName: categoryName,
    __nCode: norm(t.code),
    __nTitle: norm(t.title),
    __nDom: norm(domainName),
    __nCat: norm(categoryName)
  } as AbllsTaskEnriched;
});


// initial list
this.filteredTasks = this.sortTasks(this.tasks);
this.isReady = true;



        // initial list
        this.filteredTasks = this.sortTasks(this.tasks);
        this.isReady = true;

        // Uncomment for debugging
        console.log(this.tasks.slice(0,5).map((t:any)=>({code:t.code, dom:t.__domainName, cat:t.__categoryName, id:t.__resolvedDomainId})));
      })
      .catch(err => console.error('Erreur chargement données', err));
  }

  /** Navigation */
  goToAddTask(): void { this.router.navigate(['/admin/ablls/new']); }
  goToDetail(id: number): void { this.router.navigate(['/ablls-task', id]); }

  /** Sort by code (A1, A2, B1...) */
  private sortTasks(arr: AbllsTask[]): AbllsTask[] {
    return [...arr].sort((a: any, b: any) =>
      (a.code || '').localeCompare((b.code || ''), 'fr', { numeric: true })
    );
  }

  /** Search entrypoint */
  onSearchChange(value: string): void {
    this.search = value || '';
    this.applySmartFilter();
  }

  clearSearch(): void {
    this.search = '';
    this.matchedBy = null;
    this.filteredTasks = this.sortTasks(this.tasks);
    this.currentPage = 1;
  }

  /** Smart filter using precomputed fields */
  private applySmartFilter(): void {
  const q = (this.search || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  console.log('🔍 Query:', q);

  if (!q) {
    this.finish(null, this.tasks);
    return;
  }

  const codeMatches     = this.tasks.filter((t:any) => t.__nCode.startsWith(q));
  const titleMatches    = this.tasks.filter((t:any) => t.__nTitle.includes(q));
  const domainMatches   = this.tasks.filter((t:any) => t.__nDom.includes(q));
  const categoryMatches = this.tasks.filter((t:any) => t.__nCat.includes(q));

  console.log({
    codeMatches: codeMatches.map((t:any)=>t.code),
    titleMatches: titleMatches.map((t:any)=>t.code),
    domainMatches: domainMatches.map((t:any)=>`${t.code} (${t.__domainName})`),
    categoryMatches: categoryMatches.map((t:any)=>`${t.code} (${t.__categoryName})`)
  });

  if (codeMatches.length)   return this.finish('code', codeMatches);
  if (titleMatches.length)  return this.finish('title', titleMatches);
  if (domainMatches.length) return this.finish('domain', domainMatches);
  if (categoryMatches.length)return this.finish('category', categoryMatches);

  // fallback
  const mixed = this.tasks.filter((t:any) =>
    t.__nCode.includes(q) || t.__nTitle.includes(q) || t.__nDom.includes(q) || t.__nCat.includes(q)
  );
  this.finish(mixed.length ? 'mixed' : null, mixed);
}


  private finish(kind: MatchKind, list: AbllsTask[]): void {
    this.matchedBy = kind;
    this.filteredTasks = this.sortTasks(list);
    this.currentPage = 1;
  }

  onEdit(task: AbllsTask): void {
    if (!task) return;
    this.router.navigate(['/admin/ablls/new'], { state: { updateMode: true, task } });
  }

  onDelete(task: AbllsTask): void {
    if (!task?.id) return;
    const label = `${task.code ?? ''} - ${task.title ?? ''}`.trim();
    if (!confirm(`Confirmer la suppression de : ${label} ?`)) return;

    this.abllsTaskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.applySmartFilter();
        const pages = this.totalPages;
        if (this.currentPage > pages) this.currentPage = Math.max(1, pages);
      },
      error: () => alert('La suppression a échoué. Réessaie plus tard.')
    });
  }

  /** Pagination helpers */
  get paginatedTasks(): AbllsTask[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTasks.slice(start, start + this.pageSize);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredTasks.length / this.pageSize);
  }
}