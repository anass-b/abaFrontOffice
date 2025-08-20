import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceCategoryService } from '../../../services/resource-category/resource-category.service';
import { debounceTime, first, map, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-add-resource-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-resource-category.component.html',
  styleUrls: []
})
export class AddResourceCategoryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private rcService = inject(ResourceCategoryService);

  form!: FormGroup;
  submitting = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', {
        validators: [Validators.required],
        asyncValidators: [this.uniqueNameValidator()],
        updateOn: 'blur' // or 'change' if you prefer live checking
      }],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;

    this.rcService.create(this.form.value).subscribe({
      next: () => this.router.navigate(['/resource-categories']),
      error: err => {
        console.error('Erreur ajout catégorie ressource', err);
        this.submitting = false;
      }
    });
  }

  /** Async validator to check uniqueness via GET /api/resource-categories/check-name?name=... */
  private uniqueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const name = (control.value ?? '').trim();
      if (!name) return of(null);

      return of(name).pipe(
        debounceTime(250),
        switchMap(n => this.rcService.checkName(n)),
        map(res => res?.available === false ? { nameTaken: true } : null),
        first()
      );
    };
  }
}
