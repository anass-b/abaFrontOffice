import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { EvaluationCriteriaService } from '../../../services/evaluation-criteria/evaluation-criteria.service';
import { BaselineContentService } from '../../../services/baseline-content/baseline-content.service';
import { AbllsTask } from '../../../models/ablls-task.model';
import { EvaluationCriteria } from '../../../models/evaluation-criteria.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-baseline-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , FormsModule],
  templateUrl: './add-baseline-content.component.html',
  styleUrls: []
})
export class AddBaselineContentComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  taskService = inject(AbllsTaskService);
  criteriaService = inject(EvaluationCriteriaService);
  baselineService = inject(BaselineContentService);

  form!: FormGroup;
  tasks: AbllsTask[] = [];
  criterias: EvaluationCriteria[] = [];
  selectedTaskId: number | null = null;
abllsTasks: AbllsTask[] = [];
evaluationCriterias: EvaluationCriteria[] = [];
selectedCriteriaId: number | null = null;


  selectedFile?: File;

  ngOnInit(): void {
    this.form = this.fb.group({
      abllsTaskId: [null, Validators.required],
      criteriaId: [null, Validators.required],
      contentHtml: [''],
      file: [null]
    });

    this.taskService.fetchTasks().subscribe(res => this.tasks = res);
    this.taskService.fetchTasks().subscribe(tasks => {
    this.abllsTasks = tasks;
  });

    this.criteriaService.fetchAll().subscribe(res => this.criterias = res);
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }
onTaskSelected(event: Event): void {
  const taskId = Number((event.target as HTMLSelectElement)?.value);
  this.selectedTaskId = taskId;

  this.form.controls['abllsTaskId'].setValue(taskId); // 🔧 METTRE À JOUR LE FORMULAIRE

  this.criteriaService.fetchByTaskId(taskId).subscribe(criteria => {
    this.evaluationCriterias = criteria;
  });
}

onCriteriaSelected(critId: number) {
  this.selectedCriteriaId = critId;
  this.form.controls['criteriaId'].setValue(critId);
}




  onSubmit(): void {
    if (this.form.invalid || (!this.selectedFile && !this.form.value.contentHtml)) {
      alert('Veuillez remplir les champs obligatoires ou fournir un contenu/fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('abllsTaskId', this.form.value.abllsTaskId);
    formData.append('criteriaId', this.form.value.criteriaId);
    if (this.form.value.contentHtml) {
      formData.append('contentHtml', this.form.value.contentHtml);
    }
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.baselineService.create(formData).subscribe({
      next: () => this.router.navigate(['/ablls']), // 🔁 Redirection personnalisable
      error: err => console.error('Erreur ajout contenu ligne de base', err)
    });
  }
}
