import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss']
})
export class AdminUserFormComponent implements OnInit {
  fb = inject(FormBuilder);
  userService = inject(UserService);

  @Input() userToEdit?: User; // facultatif : si rempli = mode édition

  userForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: [this.userToEdit?.firstName ?? '', Validators.required],
      lastName: [this.userToEdit?.lastName ?? '', Validators.required],
      email: [this.userToEdit?.email ?? '', [Validators.required, Validators.email]],
      phoneNumber: [this.userToEdit?.phoneNumber ?? '', Validators.required],
      passwordHash: ['', this.userToEdit ? [] : [Validators.required, Validators.minLength(6)]],
      isAdmin: [this.userToEdit?.isAdmin ?? false],
      isVerified: [this.userToEdit?.isVerified ?? true],
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const userData: User = this.userForm.value;
    this.loading = true;

    if (this.userToEdit?.id) {
      this.userService.updateUser(this.userToEdit.id, userData).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur mis à jour.';
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la mise à jour.';
          this.loading = false;
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur créé.';
          this.userForm.reset({ isAdmin: false, isVerified: true });
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la création.';
          this.loading = false;
        }
      });
    }
  }
}
