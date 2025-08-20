import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { DocumentService } from '../../../services/document/document.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Document } from '../../../models/document.model';

type SortKey = 'recent' | 'title' | 'type';

@Component({
  selector: 'app-document-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './document-library.component.html',
  styleUrls: ['./document-library.component.scss'],
})
export class DocumentLibraryComponent implements OnInit {
  // Services
  private documentService = inject(DocumentService);
  auth = inject(AuthService);
  private router = inject(Router);

   // Données
  documents: Document[] = [];
  filteredDocuments: Document[] = [];

  // UI state
  categories: string[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';
  sortBy: SortKey = 'recent';

  // Pagination
  pageSize = 16;                 // 4 x 4
  paginationThreshold = 12;      // n’affiche la barre que si > 12
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];

  get pagedDocuments(): Document[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDocuments.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    this.loadDocuments();
  }

  // ================= Load =================
  private loadDocuments(): void {
    this.documentService.fetchDocuments().subscribe({
      next: (docs) => {
        this.documents = (docs ?? []).slice();
        this.buildCategories(this.documents);
        this.filterDocuments(); // initial
      },
      error: () => {
        this.documents = [];
        this.filteredDocuments = [];
        this.recomputePagination();
      },
    });
  }

  private buildCategories(docs: Document[]): void {
    const set = new Set<string>();
    for (const d of docs) {
      for (const c of (d.categories ?? [])) {
        const name = (c ?? '').trim();
        if (name) set.add(name);
      }
    }
    this.categories = Array.from(set).sort((a, b) =>
      a.localeCompare(b, 'fr', { sensitivity: 'base' })
    );
  }

  // ================= Filtering & sorting =================
  onCategorySelected(name: string): void {
    this.selectedCategory = name;
    this.filterDocuments();
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.sortBy = 'recent';
    this.filterDocuments();
  }

  filterDocuments(): void {
    const q = (this.searchTerm ?? '').trim().toLowerCase();

    let list = this.documents.filter((d) => {
      if (this.selectedCategory) {
        const cats = d.categories ?? [];
        const hit = cats.some(
          (c) => (c ?? '').toLowerCase() === this.selectedCategory.toLowerCase()
        );
        if (!hit) return false;
      }

      if (q) {
        const hay = [
          d.title ?? '',
          d.description ?? '',
          (d.categories ?? []).join(' ')
        ].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    switch (this.sortBy) {
      case 'recent':
        list.sort((a, b) =>
          this.dateDesc(a.updatedAt || a.createdAt, b.updatedAt || b.createdAt)
        );
        break;
      case 'title':
        list.sort((a, b) =>
          (a.title ?? '').localeCompare(b.title ?? '', 'fr', { sensitivity: 'base' })
        );
        break;
      case 'type':
        list.sort((a, b) =>
          this.getFileExtension(a.fileUrl).localeCompare(this.getFileExtension(b.fileUrl))
        );
        break;
    }

    this.filteredDocuments = list;

    // Reset page to 1 à chaque filtre/tri
    this.currentPage = 1;
    this.recomputePagination();
  }

  // ================= Pagination =================
  private recomputePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredDocuments.length / this.pageSize));
    // pages simples 1..N (tu peux faire des ellipses si besoin)
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    // Optionnel: remonter en haut de la grid
    try {
      document.querySelector('.doc-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  }

  // ================= Actions =================
  createDocument(): void {
    this.router.navigateByUrl('/admin/documents/new');
  }

  viewDocument(id?: number): void {
    if (!id) return;
    this.router.navigate(['/documents', id, 'view']);
  }

  // ================= Helpers =================
  getFileExtension(url?: string): string {
    if (!url) return '';
    const p = url.split('?')[0];
    const dot = p.lastIndexOf('.');
    if (dot < 0) return '';
    return p.substring(dot + 1).toUpperCase();
  }

  docExtensionClass(url?: string): string {
    const ext = this.getFileExtension(url).toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'doc';
    if (ext === 'xls' || ext === 'xlsx') return 'xls';
    if (ext === 'ppt' || ext === 'pptx') return 'ppt';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'img';
    if (['zip', 'rar', '7z'].includes(ext)) return 'zip';
    return 'file';
  }

  private dateDesc(a?: string, b?: string): number {
    const ta = a ? new Date(a).getTime() : 0;
    const tb = b ? new Date(b).getTime() : 0;
    return tb - ta;
  }
}

