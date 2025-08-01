// ✅ Composant AddAbllsTaskComponent avec filtrage par catégorie, génération automatique du code, liste des critères et ajout via modale
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { CategoryService } from '../../../services/category/category.service';
import { DomainService } from '../../../services/domain/domain.service';
import { MaterialPhotoService } from '../../../services/material-photo/material-photo.service';
import { EvaluationCriteriaService } from '../../../services/evaluation-criteria/evaluation-criteria.service';
import { MaterialPhoto } from '../../../models/material-photo.model';
import { Domain } from '../../../models/domain.model';
import { Category } from '../../../models/category.model';
import { EvaluationCriteria } from '../../../models/evaluation-criteria.model';
import { environment } from '../../../../environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { AddCriteriaDialogComponent } from '../../dialogs/add-criteria-dialog/add-criteria-dialog.component';



@Component({
  selector: 'app-add-ablls-task',
  templateUrl: './add-ablls-task.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AddAbllsTaskComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private taskService = inject(AbllsTaskService);
  private categoryService = inject(CategoryService);
  private domainService = inject(DomainService);
  private materialService = inject(MaterialPhotoService);
  private evaluationService = inject(EvaluationCriteriaService);
  dialog = inject(MatDialog);

  baseUrl = environment.fileBaseUrl;

  taskForm!: FormGroup;
  materialList: MaterialPhoto[] = [];
  categories: Category[] = [];
  domains: Domain[] = [];
  filteredDomains: Domain[] = [];
  evaluationCriterias: EvaluationCriteria[] = [];
  generatedCode = '';
  nbCriteres = 0;

  ngOnInit(): void {
    this.initForm();
    this.fetchCategories();
    this.fetchDomains();
    this.fetchMaterials();
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      categoryId: [null, Validators.required],
      domainId: [null, Validators.required],
      taskNumber: [null, Validators.required],
      code: [{ value: '', disabled: true }],
      title: ['', Validators.required],
      nbCriteres: [2],
      description: [''],
      explanationUseExternal: [true],
      explanationVideoUrl: [''],
      explanationVideoFile: [null],
      status: ['']
    });
  }

  fetchCategories(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
  }

  fetchDomains(): void {
    this.domainService.getAll().subscribe(domains => {
      this.domains = domains;
      this.filterDomains();
    });
  }
  updateGeneratedCode(): void {
  const domainId = this.taskForm.get('domainId')?.value;
  console.log("domainid" , domainId)
  const taskNum = this.taskForm.get('taskNumber')?.value;
  console.log("tasknum" , taskNum);

  const domain = this.domains.find(d => d.id === Number(domainId));
  console.log("domain name :" , domain)
  if (domain && taskNum != null) {
    const code = `${domain.prefix}${taskNum}`;
    this.taskForm.get('code')?.setValue(code);
    this.generatedCode = code;
    console.log('Code généré:', code);
  } else {
    this.taskForm.get('code')?.setValue('');
    this.generatedCode = '';
    console.log('Code non généré, domaine ou numéro de tâche manquant');
  }
}


  fetchMaterials(): void {
    this.materialService.fetchAll().subscribe(data => this.materialList = data);
  }
 
  onCategoryChange(): void {
    this.filterDomains();
    this.taskForm.patchValue({ domainId: null });
  }

  filterDomains(): void {
   const selectedCatId = Number(this.taskForm.get('categoryId')?.value);
  this.filteredDomains = this.domains.filter(d => d.categoryId === selectedCatId);

  }

  onDomainChange(): void {
    this.updateGeneratedCode();

  }

  onTaskNumberChange(): void {
    this.updateGeneratedCode();

  }

  openAddCriteriaDialog(): void {
  const dialogRef = this.dialog.open(AddCriteriaDialogComponent, {
    width: '700px',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.addCriteria(result);
    }
  });
}
  onCriteriaCountChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  this.nbCriteres = Number(value);
  this.updateTaskStatus();
  }

  deleteCriteria(index: number): void {
    this.evaluationCriterias.splice(index, 1);
    this.updateTaskStatus();
  }

  addCriteria(crit: EvaluationCriteria): void {
    if (this.evaluationCriterias.length < this.taskForm.get('nbCriteres')?.value) {
      this.evaluationCriterias.push(crit);
    }
    this.updateTaskStatus();
  }

  updateTaskStatus(): void {
    const defined = this.evaluationCriterias.length;
    const required = this.taskForm.get('nbCriteres')?.value;
    const status = defined < required ? 'En cours de création' : 'Complet';
    this.taskForm.get('status')?.setValue(status);
  }

  onExplanationVideoFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) this.taskForm.patchValue({ explanationVideoFile: file });
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

  const formValue = this.taskForm.getRawValue();
  const payload: any = {
    ...formValue,
    code: formValue.code,
    useExternalExplanationVideo: formValue.explanationUseExternal,
    evaluationCriterias: this.evaluationCriterias
  };

  const formData = this.convertToFormData(payload);

  this.taskService.createTask(formData).subscribe({
    next: (response) => {
      const createdCriteria = response?.evaluationCriterias;
      const allLinks: { evaluationCriteriaId: number, materialPhotoId: number }[] = [];

      createdCriteria?.forEach((critFromApi: any, i: number) => {
        const localCrit = this.evaluationCriterias[i];
        if (localCrit.materialPhotoIds?.length) {
          localCrit.materialPhotoIds.forEach((matId: number) => {
            allLinks.push({
              evaluationCriteriaId: critFromApi.id,
              materialPhotoId: matId
            });
          });
        }
      });

      Promise.all(
        allLinks.map(link =>
          this.evaluationService
            .createLink(link.evaluationCriteriaId, link.materialPhotoId)
            .toPromise()
        )
      ).then(() => {
        this.router.navigate(['/ablls']);
      }).catch(err => {
        console.error('Erreur lors de la liaison critère-matériel', err);
      });
    },
    error: err => console.error('Erreur lors de la création de la tâche', err)
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
