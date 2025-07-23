import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentService } from '../../../services/document/document.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent {
  fb = inject(FormBuilder);
  documentService = inject(DocumentService);
  router = inject(Router);

  documentForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categories: [''],
    file: [null, Validators.required],
    isPremium: [false]
  });

  uploading = false;
  fileName = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.documentForm.patchValue({ file });
      this.fileName = file.name;
    }
  }

 onSubmit(): void {
  if (this.documentForm.invalid) return;

  const categoriesRaw = this.documentForm.value.categories || '';
  const categoriesArray = categoriesRaw.split(',').map((c: string) => c.trim());

  const formData = new FormData();
  formData.append('title', this.documentForm.value.title);
  formData.append('description', this.documentForm.value.description);
  formData.append('isPremium', this.documentForm.value.isPremium.toString());
  formData.append('category', JSON.stringify(categoriesArray));
  formData.append('file', this.documentForm.value.file);

  this.uploading = true;
  this.documentService.addDocument(formData).subscribe({
    next: () => {
      this.uploading = false;
      this.router.navigateByUrl('/documents');
    },
    error: () => {
      this.uploading = false;
      alert('Erreur lors de l\'upload du document');
    }
  });
}


}
