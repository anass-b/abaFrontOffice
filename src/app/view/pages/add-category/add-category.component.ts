import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { FormsModule } from '@angular/forms';

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

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.categoryService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/categories']),
      error: err => console.error('Erreur ajout catégorie', err)
    });
  }
}
