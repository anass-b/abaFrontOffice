import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DocumentService } from '../../../services/document/document.service';
import { Document } from '../../../models/document.model';
import { SharedService } from '../../../services/shared/shared.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-document-library',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './document-library.component.html',
  styleUrls: ['./document-library.component.scss']
})
export class DocumentLibraryComponent implements OnInit {
  documentService = inject(DocumentService);
  router = inject(Router);
  shared = inject(SharedService);
  auth = inject(AuthService);
  categoryService = inject(CategoryService);

  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';
  loading = true;

  ngOnInit(): void {
    this.loadCategories();
    this.loadDocuments();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.shared.displaySnackBar("Erreur lors du chargement des catégories")
    });
  }

  loadDocuments(): void {
    this.documentService.fetchDocuments().subscribe({
      next: (docs) => {
        this.documents = docs.filter(doc =>
          this.auth.isAdmin ||
          this.auth.isOwner({ createdBy: doc.createdBy! }) ||
          this.auth.hasAccessToContent({ isPremium: doc.isPremium!, createdBy: doc.createdBy! })
        );
        this.filterDocuments();
        this.loading = false;
      },
      error: () => {
        this.shared.displaySnackBar("Erreur lors du chargement des documents");
        this.loading = false;
      }
    });
  }

  filterDocuments(): void {
  this.filteredDocuments = this.documents.filter(doc =>
    (!this.selectedCategory || doc.categories?.some(cat => cat.name === this.selectedCategory)) &&
    (!this.searchTerm || doc.title?.toLowerCase().includes(this.searchTerm.toLowerCase()))
  );
}

  onCategorySelected(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.filterDocuments();
  }

  onSearch(): void {
    this.filterDocuments();
  }

  getFileExtension(fileUrl: string | undefined): string {
    const parts = fileUrl?.split('.');
    return parts?.length ? parts.pop()?.toUpperCase() || '' : '';
  }

  docExtensionClass(fileUrl: string | undefined): string {
    const ext = this.getFileExtension(fileUrl).toLowerCase();
    return ext === 'pdf' ? 'pdf' : ext === 'xls' || ext === 'xlsx' ? 'xls' : ext === 'pshi' ? 'pshi' : '';
  }

  createDocument(): void {
    this.router.navigateByUrl('/documents/new');
  }

  viewDocument(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/documents', id, 'view']);
  }

  viewDetails(docId: number | undefined): void {
    this.router.navigate(['/documents', docId]);
  }

  editDocument(doc: Document): void {
    this.router.navigate(['/documents/edit', doc.id]);
  }

  deleteDocument(docId: number | undefined): void {
    this.shared.openConfirmationDialog('Voulez-vous supprimer ce document ?', false)
      .afterClosed().subscribe(result => {
        if (result === true) {
          this.documentService.deleteDocument(docId).subscribe(() => {
            this.shared.displaySnackBar("Document supprimé");
            this.loadDocuments();
          });
        }
      });
  }
}
