import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentService } from '../../../services/document/document.service';
import { Router } from '@angular/router';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category/category.service';
import { NgSelectModule } from '@ng-select/ng-select';

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
  categoryService = inject(CategoryService);
  router = inject(Router);

  allCategories: Category[] = [];

  documentForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categories: [[], Validators.required],
    url: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)[^\s]+$/i)]],
    isPremium: [false]
  });

  uploading = false;

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (cats) => (this.allCategories = cats),
      error: () => alert('Erreur lors du chargement des catégories')
    });
  }

  onSubmit(): void {
    if (this.documentForm.invalid) return;

    const values = this.documentForm.value;
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('isPremium', values.isPremium.toString());

    // ASP.NET Core liera bien une List<string> avec des clés répétées "categories"
    if (values.categories?.length) {
      values.categories.forEach((cat: string, i: number) => {
        formData.append('categories', cat); // ou `categories[${i}]` si tu préfères indexer
      });
    }

    // 🔑 BACK attend FileUrl
    formData.append('fileUrl', values.url);

    this.uploading = true;
    this.documentService.addDocument(formData).subscribe({
      next: () => {
        this.uploading = false;
        this.router.navigateByUrl('/documents');
      },
      error: () => {
        this.uploading = false;
        alert("Erreur lors de l'envoi du document");
      }
    });
  }
}
