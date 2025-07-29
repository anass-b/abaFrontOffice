import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialPhoto } from '../../../models/material-photo.model';
import { MaterialPhotoService } from '../../../services/material-photo/material-photo.service';
import {environment } from '../../../../environments/environments';
import { EvaluationCriteriaService } from '../../../services/evaluation-criteria/evaluation-criteria.service';

@Component({
  selector: 'app-add-ablls-task',
  templateUrl: './add-ablls-task.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AddAbllsTaskComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(AbllsTaskService);
  private router = inject(Router);
  materialService = inject(MaterialPhotoService);
  evaluationCriteriaService = inject(EvaluationCriteriaService);
  baseUrl = environment.fileBaseUrl;

  taskForm!: FormGroup;
  nbCriteres: number = 2;
  materialList: MaterialPhoto[] = [];
  materials: MaterialPhoto[] = [];


  ngOnInit(): void {
    this.initForm();
    this.setCriteres(this.nbCriteres);
    this.materialService.fetchAll().subscribe({
  next: (data) => {
    this.materialList = data ?? [];
  },
  error: () => {
    this.materialList = [];
  }
});


  }

  initForm(): void {
    this.taskForm = this.fb.group({
      code: ['', Validators.required],
      title: ['', Validators.required],
      domain: [''],
      explanationUseExternal: [true],
      explanationVideoUrl: [''],
      explanationVideoFile: [null],
      description: [''],
      material: [''],
      materialUrl: [''],
      evaluationCriterias: this.fb.array([])
    });
  }
 onMaterialToggle(event: any, index: number): void {
  const control = this.evaluationCriterias.at(index).get('materialPhotoIds');
  const array = control!.value as number[];
  const materialId = parseInt(event.target.value, 10);

  const updated = event.target.checked
    ? Array.from(new Set([...array, materialId])) // empêche les doublons
    : array.filter(id => id !== materialId);

  control!.setValue(updated);
}


  get evaluationCriterias(): FormArray {
    return this.taskForm.get('evaluationCriterias') as FormArray;
  }

 onCriteriaCountChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.nbCriteres = parseInt(target.value, 10);
  this.setCriteres(this.nbCriteres);
}


 setCriteres(count: number): void {
  const array: FormGroup[] = [];

  for (let i = 0; i < count; i++) {
    array.push(
  this.fb.group({
    label: this.fb.control('', Validators.required),
    useExternalDemonstrationVideo: this.fb.control(true),
    demonstrationVideoUrl: this.fb.control(''),
    demonstrationVideoFile: this.fb.control(null),
    demonstrationVideoPath: this.fb.control(''),

    consigne: this.fb.control(''),                   
    expectedResponse: this.fb.control('Pointage'),   

    guidanceType: this.fb.control('Aucune'),
    successRate: this.fb.control(80),
    materialPhotoIds: this.fb.control([])
  })
);

  }

  this.taskForm.setControl('evaluationCriterias', this.fb.array(array));
}
onCriteriaVideoTypeChange(event: Event, index: number): void {
  const isExternal = (event.target as HTMLSelectElement).value === 'true';
  const control = this.evaluationCriterias.at(index);

  control.patchValue({
    useExternalDemonstrationVideo: isExternal,
    demonstrationVideoUrl: '',
    demonstrationVideoFile: null
  });
}

onDemonstrationVideoFileSelected(event: any, index: number): void {
  const file = event.target.files?.[0];
  if (file) {
    this.evaluationCriterias.at(index).patchValue({ demonstrationVideoFile: file });
  }
}


  onExplanationVideoFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.taskForm.patchValue({ explanationVideoFile: file });
    }
  }

  onExplanationTypeChange(event: Event): void {
    const isExternal = (event.target as HTMLSelectElement).value === 'true';
    this.taskForm.patchValue({
      explanationUseExternal: isExternal,
      explanationVideoUrl: '',
      explanationVideoFile: null
    });
  }

onSubmit(): void {
  if (this.taskForm.invalid) return;

  const formValue = this.taskForm.value;

  const payload: any = {
    code: formValue.code,
    title: formValue.title,
    domain: formValue.domain,
    useExternalExplanationVideo: formValue.explanationUseExternal,
    description: formValue.description,
    materialPhotos: [
      {
        name: 'Matériel principal',
        description: formValue.material,
        fileUrl: formValue.materialUrl
      }
    ],
   evaluationCriterias: formValue.evaluationCriterias.map((crit: any) => ({
  label: crit.label,
  useExternalDemonstrationVideo: crit.useExternalDemonstrationVideo,
  demonstrationVideoUrl: crit.demonstrationVideoUrl,
  demonstrationVideoFile: crit.demonstrationVideoFile,
  demonstrationVideoPath: crit.demonstrationVideoPath,

  consigne: crit.consigne,
  expectedResponse: crit.expectedResponse,

  guidanceType: crit.guidanceType,
  successRate: crit.successRate,
}))

  };

  if (formValue.explanationUseExternal) {
    payload.explanationVideoUrl = formValue.explanationVideoUrl;
  } else if (formValue.explanationVideoFile) {
    payload.explanationVideoFile = formValue.explanationVideoFile;
  }

  const formData = this.convertToFormData(payload);

  // Ajoute les MaterialPhotoIds dans le formData (pour le backend principal uniquement)
  formValue.evaluationCriterias.forEach((crit: any, i: number) => {
    crit.materialPhotoIds.forEach((id: number, j: number) => {
      formData.append(`evaluationCriterias[${i}].MaterialPhotoIds[${j}]`, id.toString());
    });
  });

  // 📦 Envoie la tâche complète
  this.taskService.createTask(formData).subscribe({
    next: (createdTask) => {
      const criterias = createdTask?.evaluationCriterias;
      const linkRequests: Promise<any>[] = [];

      // 🔁 Pour chaque critère, envoie les liens vers le controller spécifique
      if (criterias) {
        formValue.evaluationCriterias.forEach((crit: any, i: number) => {
          const criteriaId = criterias[i]?.id;
          if (!criteriaId) return;

          crit.materialPhotoIds.forEach((materialId: number) => {
            console.log('Envoi lien:', { criteriaId, materialId });

            linkRequests.push(
              
              this.evaluationCriteriaService.createLink(criteriaId, materialId).toPromise()
            );
          });
        });
      }

      Promise.all(linkRequests)
        .then(() => this.router.navigate(['/ablls']))
        .catch(err => console.error('Erreur liaison critère-matériel', err));
    },
    error: (err) => console.error('Erreur lors de la création de la tâche', err)
  });
}




private convertToFormData(data: any, formData: FormData = new FormData(), parentKey: string | null = null): FormData {
  Object.keys(data).forEach(key => {
    const value = data[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${formKey}[${index}]`;
        if (item instanceof File) {
          formData.append(arrayKey, item);
        } else if (typeof item === 'object' && item !== null) {
          this.convertToFormData(item, formData, arrayKey);
        } else {
          formData.append(arrayKey, item);
        }
      });
    } else if (value instanceof File) {
      formData.append(formKey, value);
    } else if (typeof value === 'object' && value !== null) {
      this.convertToFormData(value, formData, formKey);
    } else if (value !== undefined && value !== null) {
      formData.append(formKey, value);
    }
  });

  return formData;
}






}
