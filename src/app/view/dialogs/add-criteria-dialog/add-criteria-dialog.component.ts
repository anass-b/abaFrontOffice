import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialPhotoService } from '../../../services/material-photo/material-photo.service';
import { MaterialPhoto } from '../../../models/material-photo.model';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-add-critera-dialog',
  standalone: true,
  templateUrl: './add-criteria-dialog.component.html',
  styleUrls: ['./add-criteria-dialog.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class AddCriteriaDialogComponent implements OnInit {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddCriteriaDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  photoService = inject(MaterialPhotoService);

  form!: FormGroup;
  materialPhotos: MaterialPhoto[] = [];
  selectedMaterialIds: number[] = [];
  useExternal = true;
  baseUrl = environment.fileBaseUrl;

  ngOnInit(): void {
    this.initForm();
    this.photoService.fetchAll().subscribe({
      next: res => this.materialPhotos = res ?? []
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      label: ['', Validators.required],
      consigne: [''],
      expectedResponse: ['Pointage'],
      guidanceType: ['Aucune'],
      successRate: [80],
      useExternalDemonstrationVideo: [true],
      demonstrationVideoUrl: [''],
      demonstrationVideoFile: [null],
      demonstrationThumbnail: [null],
      materialPhotoIds: [[]]
    });
  }

 onVideoTypeChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.useExternal = target.value === 'url';
  this.form.patchValue({
    demonstrationVideoUrl: '',
    demonstrationVideoFile: null
  });
}
onVideoFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    this.form.patchValue({
      demonstrationVideoFile: input.files[0]
    });
  }
}
onThumbnailSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    this.form.patchValue({
      demonstrationThumbnail: input.files[0]
    });
  }
}



  toggleMaterialSelection(id: number): void {
    const index = this.selectedMaterialIds.indexOf(id);
    if (index === -1) {
      this.selectedMaterialIds.push(id);
    } else {
      this.selectedMaterialIds.splice(index, 1);
    }
    this.form.patchValue({ materialPhotoIds: this.selectedMaterialIds });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close('Cancel');
  }
}
