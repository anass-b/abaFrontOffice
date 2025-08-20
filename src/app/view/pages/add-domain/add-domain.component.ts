import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomainService } from '../../../services/domain/domain.service';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category.model';
import { FormsModule } from '@angular/forms';
import { Domain } from '../../../models/domain.model';

@Component({
  selector: 'app-add-domain',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-domain.component.html',
  styleUrls: []
})
export class AddDomainComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  domainService = inject(DomainService);
  categoryService = inject(CategoryService);

  form!: FormGroup;
  categories: Category[] = [];

  updateMode = false;
domainIdToEdit?: number;
rowVersion?: number; // si tu l’utilises côté back (optionnel)


 ngOnInit(): void {
  this.form = this.fb.group({
    name: ['', Validators.required],
    prefix: ['', Validators.required],
    categoryId: [null, Validators.required]
  });

  // 1) Charger catégories
  this.categoryService.getAll().subscribe(cats => {
    this.categories = cats || [];

    // 2) Vérifier si on vient en mode édition
    const data = history.state;
    if (data && data.updateMode && data.domain) {
      this.updateMode = true;
      this.domainIdToEdit = data.domain.id;
      this.rowVersion = data.domain.rowVersion;

      this.populateForm(data.domain);
    }
  });
}
populateForm(domain: any): void {
  this.form.patchValue({
    name: domain.name ?? '',
    prefix: domain.prefix ?? '',
    categoryId: domain.categoryId ?? null
  });

  // (Optionnel) verrouiller prefix & catégorie en édition
  // this.form.get('prefix')?.disable();
  // this.form.get('categoryId')?.disable();
}


onSubmit(): void {
  if (this.form.invalid) return;

  const value = this.form.getRawValue(); // au cas où certains champs sont disabled
  const payload: Domain = {
    id: this.domainIdToEdit,                    // utile côté back si tu le lis du body
    name: (value.name || '').trim(),
    prefix: (value.prefix || '').trim(),
    categoryId: Number(value.categoryId),
    rowVersion: this.rowVersion                 // si tu gères la concurrence
  } as Domain;

  if (this.updateMode && this.domainIdToEdit) {
    this.domainService.update(this.domainIdToEdit, payload).subscribe({
      next: () => this.router.navigate(['/admin/domaines']),
      error: err => console.error('Erreur mise à jour domaine', err)
    });
  } else {
    this.domainService.create(payload).subscribe({
      next: () => this.router.navigate(['/admin/domaines']),
      error: err => console.error('Erreur ajout domaine', err)
    });
  }
}


}
