import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { AbllsTask } from '../../../models/ablls-task.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CategoryService } from '../../../services/category/category.service';
import { Domain } from '../../../models/domain.model';
import { ActivatedRoute } from '@angular/router';

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
  route = inject(ActivatedRoute);


  tasks: AbllsTask[] = [];
  matchedBy: 'code' | 'title' | 'domain' | 'category' | null = null;

  groupedByCategory: { [categoryName: string]: { [domainName: string]: AbllsTask[] } } = {};
  categoryMap: { [id: number]: string } = {};
  domainMap: { [domainName: string]: Domain } = {};
  search = '';
  selectedCategory: string | null = null;
  selectedDomain: string | null = null;
  isReady = false;


 ngOnInit(): void {
  const queryParams = this.route.snapshot.queryParams;
  this.selectedCategory = queryParams['category'] ?? null;
  this.selectedDomain = queryParams['domain'] ?? null;

  this.abllsTaskService.fetchTasks().subscribe(async tasks => {
    this.tasks = tasks;

    const categoryIds = new Set<number>();
    tasks.forEach(task => {
      if (task.domain?.categoryId) {
        categoryIds.add(task.domain.categoryId);
      }
    });

    const idsArray = Array.from(categoryIds);

    if (idsArray.length === 0) {
      this.groupTasks(this.tasks);
      this.isReady = true;
      return;
    }

    try {
      const categoryRequests = idsArray.map(id =>
        this.categoryService.getById(id).toPromise()
      );

      const categories = await Promise.all(categoryRequests);

      categories.forEach((cat, index) => {
        const id = idsArray[index];
        this.categoryMap[id] = cat?.name ?? 'Catégorie inconnue';
      });

      this.groupTasks(this.tasks);
      this.isReady = true;
    } catch (error) {
      console.error('Erreur lors du chargement des catégories :', error);
    }
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
  goToAddTask(): void {
  this.router.navigate(['/ablls/new']);
}
//onSearchChange(value: string): void {
//  console.log('[🔍 onSearchChange] New value:', value);
//
//  if (!value) {
//    console.log('[🧹 onSearchChange] Clearing search');
//    this.clearCategory();
//    return;
//  }
//
// this.smartSearch(value); // toujours rechercher
//
//}



//smartSearch(term: string): void {
//  const cleanTerm = term.trim().toLowerCase();
//  console.log('[🔍 smartSearch] Searching for:', cleanTerm);
//
//  let matchedTask: AbllsTask | undefined;
//
//  // === Étape 1 : chercher par CODE (startsWith)
//  matchedTask = this.tasks.find(t =>
//    t.code?.toLowerCase().startsWith(cleanTerm)
//  );
//
//  if (matchedTask) {
//    const domain = matchedTask.domain!;
//    const categoryName = this.categoryMap[domain.categoryId];
//    console.log(`[✅ MATCH by CODE] Task ${matchedTask.code} in category ${categoryName}, domain ${domain.name}`);
//
//    this.selectedCategory = categoryName;
//    this.selectedDomain = domain.name;
//    return;
//  }
//
//  // === Étape 2 : chercher par TITLE (includes)
//  matchedTask = this.tasks.find(t =>
//    t.title?.toLowerCase().includes(cleanTerm)
//  );
//
//  if (matchedTask) {
//    const domain = matchedTask.domain!;
//    const categoryName = this.categoryMap[domain.categoryId];
//    console.log(`[✅ MATCH by TITLE] Task ${matchedTask.code} in category ${categoryName}, domain ${domain.name}`);
//
//    this.selectedCategory = categoryName;
//    this.selectedDomain = domain.name;
//    return;
//  }
//
//  // === Étape 3 : chercher par domaine
//  for (const [catName, domains] of Object.entries(this.groupedByCategory)) {
//    for (const domainName of Object.keys(domains)) {
//      if (domainName.toLowerCase().includes(cleanTerm)) {
//        console.log(`[✅ MATCH by DOMAIN] → ${domainName}`);
//        this.selectedCategory = catName;
//        this.selectedDomain = domainName;
//        return;
//      }
//    }
//  }
//
//  // === Étape 4 : chercher par catégorie
//  for (const catName of Object.keys(this.groupedByCategory)) {
//    if (catName.toLowerCase().includes(cleanTerm)) {
//      console.log(`[✅ MATCH by CATEGORY] → ${catName}`);
//      this.selectedCategory = catName;
//      this.selectedDomain = null;
//      return;
//    }
//  }
//
//  console.warn('[❌ smartSearch] No match found for:', cleanTerm);
//}
//
//
//

smartSearch(term: string): void {
  const cleanTerm = term.trim().toLowerCase();
  let matchedTask: AbllsTask | undefined;

  // 1) CODE
  matchedTask = this.tasks.find(t => t.code?.toLowerCase().startsWith(cleanTerm));
  if (matchedTask) {
    const d = matchedTask.domain!;
    const categoryName = this.categoryMap[d.categoryId];
    this.selectedCategory = categoryName;
    this.selectedDomain   = d.name;
    this.matchedBy = 'code';      
    return;
  }

  // 2) TITLE
  matchedTask = this.tasks.find(t => t.title?.toLowerCase().includes(cleanTerm));
  if (matchedTask) {
    const d = matchedTask.domain!;
    const categoryName = this.categoryMap[d.categoryId];
    this.selectedCategory = categoryName;
    this.selectedDomain   = d.name;
    this.matchedBy = 'title';     
    return;
  }

  // 3) DOMAIN
  for (const [catName, domains] of Object.entries(this.groupedByCategory)) {
    for (const domainName of Object.keys(domains)) {
      if (domainName.toLowerCase().includes(cleanTerm)) {
        this.selectedCategory = catName;
        this.selectedDomain   = domainName;
        this.matchedBy = 'domain'; 
        return;
      }
    }
  }

  // 4) CATEGORY
  for (const catName of Object.keys(this.groupedByCategory)) {
    if (catName.toLowerCase().includes(cleanTerm)) {
      this.selectedCategory = catName;
      this.selectedDomain   = '__ALL__';
      this.matchedBy = 'category'; 
      return;
    }
  }

  console.warn('[❌ smartSearch] No match found for:', cleanTerm);
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
    console.log('[📦 groupTasks] categoryMap:', this.categoryMap);
console.log('[📦 groupTasks] groupedByCategory:', this.groupedByCategory);

  }

  onSearchChange(value: string): void {
  if (!value) {
    this.search = '';
    this.matchedBy = null;        
    this.clearCategory();
    return;
  }
  this.smartSearch(value);
}

clearCategory() {
  this.selectedCategory = null;
  this.selectedDomain = null;
  this.matchedBy = null;          
}

clearDomain() {
  this.selectedDomain = null;
  this.matchedBy = null;          
}

selectCategory(category: string) {
  this.selectedCategory = category;
  this.matchedBy = null;          
}

selectDomain(domain: string) {
  this.selectedDomain = domain;
  this.matchedBy = null;          
}


 getFilteredCategories(): string[] {
  const term = this.search.toLowerCase();
  return Object.keys(this.groupedByCategory).filter(cat =>
    cat.toLowerCase().includes(term)
  );
}

getFilteredDomains(): string[] {
  const term = this.search.toLowerCase();
  return Object.keys(this.groupedByCategory[this.selectedCategory!]).filter(domain =>
    domain.toLowerCase().includes(term)
  );
}

//getFilteredTasks(): AbllsTask[] {
//  const term = this.search.toLowerCase();
//  return this.groupedByCategory[this.selectedCategory!][this.selectedDomain!].filter(task =>
//    task.title?.toLowerCase().includes(term) || task.code?.toLowerCase().includes(term)
//  );
//}
getFilteredTasks(): AbllsTask[] {
  const term = this.search.toLowerCase();

  // 👉 Cas "recherche par titre" (includes): on remonte TOUTES les tâches matchées,
  //    pas seulement celles du domaine/catégorie pré-sélectionné par smartSearch.
  if (this.matchedBy === 'title') {
    return this.tasks.filter(t =>
      t.title?.toLowerCase().includes(term) || t.code?.toLowerCase().includes(term)
    );
  }

  // 👉 Cas "catégorie" => __ALL__: toutes les tâches de la catégorie (comme avant)
  if (this.selectedCategory && this.selectedDomain === '__ALL__') {
    let all: AbllsTask[] = [];
    const domains = this.groupedByCategory[this.selectedCategory] || {};
    for (const d of Object.keys(domains)) all = all.concat(domains[d]);
    if (this.matchedBy === 'category') return all;
    return all.filter(t =>
      t.title?.toLowerCase().includes(term) || t.code?.toLowerCase().includes(term)
    );
  }

  // 👉 Cas "domaine" normal
  if (this.selectedCategory && this.selectedDomain) {
    const list = this.groupedByCategory[this.selectedCategory][this.selectedDomain] || [];
    if (this.matchedBy === 'domain') return list; // pas de filtre texte
    return list.filter(t =>
      t.title?.toLowerCase().includes(term) || t.code?.toLowerCase().includes(term)
    );
  }

  return [];
}



  getTotalDomainsInCategory(category: string): number {
  return Object.keys(this.groupedByCategory[category]).length;
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

  //selectCategory(category: string) {
  //  this.selectedCategory = category;
  //}
//
  //selectDomain(domain: string) {
  //  this.selectedDomain = domain;
  //}
//
  //clearCategory() {
  //  this.selectedCategory = null;
  //  this.selectedDomain = null;
  //}
//
  //clearDomain() {
  //  this.selectedDomain = null;
  //}

  goToDetail(id: number): void {
  this.router.navigate(['/ablls-task', id], {
    queryParams: {
      category: this.selectedCategory,
      domain: this.selectedDomain
    }
  });
}

}
