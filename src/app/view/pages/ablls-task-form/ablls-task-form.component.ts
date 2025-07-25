import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service';
import { AbllsVideoService } from '../../../services/ablls-video/ablls-video.service';
import { AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-ablls-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ablls-task-form.component.html',
  styleUrls: ['./ablls-task-form.component.scss']
})
export class AbllsTaskFormComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  taskService = inject(AbllsTaskService);
  videoService = inject(AbllsVideoService);

  taskForm!: FormGroup;

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      reference: [''],
      title: ['', Validators.required],
      description: [''],
      domain: [''],
      baselineText: [''],
      baselineVideo: [''],
      materials: this.fb.array([]),
      instructions: [''],

      evaluationVideo: this.fb.group({
        url: ['', Validators.required],
        description: [''],
        thumbnailUrl: ['']
      }),

      complementaryVideos: this.fb.array([]),
      criteriaVideos: this.fb.array([])
    });
  }
get evaluationVideoGroup(): FormGroup {
  return this.taskForm.get('evaluationVideo') as FormGroup;
}

get elementaryVideos(): FormArray {
  return this.taskForm.get('elementaryVideos') as FormArray;
}
getMaterialControl(i: number): FormControl {
  return this.materials.at(i) as FormControl;
}
asFormGroup(ctrl: AbstractControl): FormGroup {
  return ctrl as FormGroup;
}






  get materials(): FormArray {
    return this.taskForm.get('materials') as FormArray;
  }

  get complementaryVideos(): FormArray {
    return this.taskForm.get('complementaryVideos') as FormArray;
  }

  get criteriaVideos(): FormArray {
    return this.taskForm.get('criteriaVideos') as FormArray;
  }

  addMaterial(): void {
    this.materials.push(this.fb.control(''));
  }

  addComplementaryVideo(): void {
    this.complementaryVideos.push(
      this.fb.group({
        url: [''],
        description: [''],
        thumbnailUrl: ['']
      })
    );
  }

  addCriteriaVideo(): void {
    if (this.criteriaVideos.length >= 4) return;
    this.criteriaVideos.push(
      this.fb.group({
        type: [`Critère ${this.criteriaVideos.length + 1}`],
        url: [''],
        description: [''],
        thumbnailUrl: ['']
      })
    );
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    const taskData = this.taskForm.value;

    // Étape 1 : Créer la tâche ABLLS
    this.taskService.createTask(taskData).subscribe({
      next: (createdTask) => {
        const taskId = createdTask?.id;
        if (!taskId) return;

        const videoPayloads = [];

        // Vidéo d’évaluation
        videoPayloads.push({
          taskId,
          type: 'Évaluation',
          ...taskData.evaluationVideo
        });

        // Complémentaires
        taskData.complementaryVideos.forEach((vid: any) =>
          videoPayloads.push({
            taskId,
            type: 'Complémentaire',
            ...vid
          })
        );

        // Critères
        taskData.criteriaVideos.forEach((vid: any) =>
          videoPayloads.push({
            taskId,
            type: vid.type,
            ...vid
          })
        );

        // Envoi en cascade des vidéos
        videoPayloads.forEach(video => {
          this.videoService.addAbllsVideo(video).subscribe();
        });

        this.router.navigateByUrl('/ablls');
      }
    });
  }
}
