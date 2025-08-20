import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: []
})
export class AddCategoryComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  categoryService = inject(CategoryService);

  form!: FormGroup;
  updateMode = false;
categoryIdToEdit?: number;
rowVersion?: number; // si tu l’utilises côté back


  ngOnInit(): void {
  this.form = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  const data = history.state;
  if (data && data.updateMode && data.category) {
    this.updateMode = true;
    this.categoryIdToEdit = data.category.id;
    this.rowVersion = data.category.rowVersion;
    this.populateForm(data.category);
  }
}

private populateForm(category: any): void {
  this.form.patchValue({
    name: category.name ?? '',
    description: category.description ?? ''
  });

  // (optionnel) verrouiller le nom en édition :
  // this.form.get('name')?.disable();
}


onSubmit(): void {
  if (this.form.invalid) return;

  // getRawValue pour récupérer d'éventuels champs disabled
  const v = this.form.getRawValue();

  // ⚠️ Construire un payload "propre" (n’inclut pas domains)
  const payload: Category = {
    id: this.categoryIdToEdit,                 // utile si ton back le lit du body
    name: (v.name || '').trim(),
    description: v.description || undefined,
    rowVersion: this.rowVersion                // si ton back l’utilise
  } as Category;

  if (this.updateMode && this.categoryIdToEdit) {
    this.categoryService.update(this.categoryIdToEdit, payload).subscribe({
      next: () => this.router.navigate(['/admin/categories']),
      error: err => console.error('Erreur mise à jour catégorie', err)
    });
  } else {
    // En création, on n’envoie que name/description
    const createPayload: Category = {
      name: payload.name,
      description: payload.description
    } as Category;

    this.categoryService.create(createPayload).subscribe({
      next: () => this.router.navigate(['/categories']),
      error: err => console.error('Erreur ajout catégorie', err)
    });
  }
}


}
