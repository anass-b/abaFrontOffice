import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomainService } from '../../../services/domain/domain.service';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category.model';
import { FormsModule } from '@angular/forms';

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

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      prefix: ['', Validators.required],
      categoryId: [null, Validators.required]
    });

    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.domainService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/domains']),
      error: err => console.error('Erreur ajout domaine', err)
    });
  }
}
