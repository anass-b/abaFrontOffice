import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialPhotoService } from '../../../services/material-photo/material-photo.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-material-photo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-material-photo.component.html',
  styleUrls: []
})
export class AddMaterialPhotoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private materialService = inject(MaterialPhotoService);
  private router = inject(Router);

  materialForm!: FormGroup;
  selectedFile?: File;

  ngOnInit(): void {
    this.materialForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      videoUrl: [''],
      file: [null]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.materialForm.patchValue({ file });
    }
  }

 onSubmit(): void {
  if (this.materialForm.invalid) return;

  const formValue = this.materialForm.value;
  const hasFile = !!this.selectedFile;
  const hasUrl = !!formValue.videoUrl?.trim();

  if (!hasFile && !hasUrl) {
    alert("Veuillez fournir soit un fichier, soit une URL de vidéo.");
    return;
  }

  const formData = new FormData();
  formData.append('name', formValue.name);
  if (formValue.description) formData.append('description', formValue.description);
  if (hasUrl) formData.append('videoUrl', formValue.videoUrl);
  if (hasFile) formData.append('file', this.selectedFile!);

  this.materialService.uploadMaterialFile(formData).subscribe({
    next: () => this.router.navigate(['/materials']),
    error: err => console.error('Erreur lors de l’upload du matériel', err)
  });
}

}
