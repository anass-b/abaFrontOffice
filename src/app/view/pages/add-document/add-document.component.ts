import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { DocumentService } from '../../../services/document/document.service';
import { ResourceCategoryService } from '../../../services/resource-category/resource-category.service';
import { SharedService } from '../../../services/shared/shared.service';

import { ResourceCategory } from '../../../models/resource-category.model';
import { DocumentCreateRequest, DocumentUpdateRequest } from '../../../models/document.model';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {
  fb = inject(FormBuilder);
  documentService = inject(DocumentService);
  rcService = inject(ResourceCategoryService);
  shared = inject(SharedService);
  router = inject(Router);

  allCategories: ResourceCategory[] = [];
  updateMode = false;
docIdToEdit?: number;
rowVersion?: number;


  documentForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categoryIds: [[] as number[]],
    isPremium: [false],
    file: [null, Validators.required] // bound via onFileSelected
  });

  uploading = false;

  ngOnInit(): void {
  // Charger les catégories
  this.rcService.list().subscribe({
    next: (cats) => {
      this.allCategories = (cats || []).map(c => ({
        ...c,
        name: this.shared.fixEncoding(c.name),
        description: c.description ? this.shared.fixEncoding(c.description) : undefined
      }));
    },
    error: () => alert('Erreur lors du chargement des catégories')
  });

  // Mode édition
  const data = history.state;
  if (data && data.updateMode && data.document) {
    this.updateMode = true;
    this.docIdToEdit = data.document.id;
    this.rowVersion = data.document.rowVersion;

    this.populateForm(data.document);
  }
}
populateForm(doc: any): void {
  this.documentForm.patchValue({
    title: doc.title,
    description: doc.description,
    categoryIds: doc.categoryIds ?? [],
    isPremium: doc.isPremium ?? false
  });

  // En édition, le fichier n’est pas obligatoire (tu gardes l’existant si non remplacé)
  this.documentForm.get('file')?.clearValidators();
  this.documentForm.get('file')?.updateValueAndValidity();
}


  onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.documentForm.patchValue({ file });
    this.documentForm.get('file')?.markAsTouched();
  }

  onSubmit(): void {
  if (this.documentForm.invalid || this.uploading) return;

  const v = this.documentForm.value;

  // build payload
  const payload: DocumentCreateRequest = {
    title: (v.title || '').trim(),
    description: v.description || undefined,
    isPremium: !!v.isPremium,
    categoryIds: (v.categoryIds as number[]) ?? [],
    file: v.file // File (required in create)
  };

  this.uploading = true;

  if (this.updateMode && this.docIdToEdit) {
    // --- UPDATE ---
    const req: DocumentUpdateRequest = {
      id: this.docIdToEdit,
      title: payload.title,
      description: payload.description,
      isPremium: payload.isPremium,
      categoryIds: payload.categoryIds,
      newFile: v.file ?? undefined, // only if admin selected a new one
      // rowVersion: this.rowVersion, // add if your API requires it
    };

    this.documentService.updateDocument(req).subscribe({
      next: () => { this.uploading = false; this.router.navigateByUrl('/admin/documents'); },
      error: () => { this.uploading = false; alert("Erreur lors de la mise à jour du document"); }
    });

  } else {
    // --- CREATE ---
    if (!payload.file) {
      this.uploading = false;
      this.documentForm.get('file')?.markAsTouched();
      return;
    }

    this.documentService.addDocument(payload).subscribe({
      next: () => { this.uploading = false; this.router.navigateByUrl('/admin/documents'); },
      error: () => { this.uploading = false; alert("Erreur lors de l'envoi du document"); }
    });
  }
}


}
