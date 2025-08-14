import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { SharedService } from '../../../services/shared/shared.service';
import { User } from '../../../models/user.model';
import { environment } from '../../../../environments/environments';
import { RecaptchaComponent } from '../../../components/RecapatchaComponent';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, RecaptchaComponent , ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.scss'],
})
export class RegisterComponent implements OnInit {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  shared = inject(SharedService);

  registerForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  captchaPassed = false;
  siteKey = environment.recaptchaSiteKey;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      profileType: ['parent', Validators.required],
      parentInfo: this.fb.group({
        nombreEnfants: [1],
        nombreEnfantsDiagnostiques: [0],
        children: this.fb.array([]),
      }),
      professionalInfo: this.fb.group({
        statuts: [''],
        structure: [''],
        fonction: [''],
        nbEnfantsTsa: [0],
      }),
    });
    if (this.registerForm.value.profileType === 'parent') {
    this.addChild();
  }
  console.log("recapatchaSiteKey", this.siteKey);
  }

  // 👶 Gestion des enfants
  get childrenFormArray(): FormArray {
    return this.registerForm.get('parentInfo.children') as FormArray;
  }

  addChild(): void {
    const childForm = this.fb.group({
      age: [null, Validators.required],
      diagnostics: [''],
    });
    this.childrenFormArray.push(childForm);
  }

  removeChild(index: number): void {
    this.childrenFormArray.removeAt(index);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onCaptchaResolved(response: string | null): void {
    this.captchaPassed = !!response;
  }

  get parentInfoGroup(): FormGroup {
  return this.registerForm.get('parentInfo') as FormGroup;
}

get professionalInfoGroup(): FormGroup {
  return this.registerForm.get('professionalInfo') as FormGroup;
}


  onSubmit(): void {
    if (this.registerForm.invalid || !this.captchaPassed) return;

    const password = this.registerForm.value.password;
    const confirmPassword = this.registerForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    const formValue = this.registerForm.value;

    const newUser: User = {
      email: formValue.email,
      passwordHash: password,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phoneNumber: formValue.phoneNumber,
      isVerified: false,
      isAdmin: false,
      profileType: formValue.profileType,
    };

    // Ajouter la partie dynamique selon profil
   if (formValue.profileType === 'parent') {
  newUser.parentInfo = formValue.parentInfo;
  newUser.professionalInfo = null; // 👈 IMPORTANT
} else if (formValue.profileType === 'pro') {
  newUser.professionalInfo = formValue.professionalInfo;
  newUser.parentInfo = null; // 👈 IMPORTANT
}


    this.loading = true;

    this.auth.register(newUser).subscribe({
      next: (user) => {
        if (user) {
          this.shared.displaySnackBar('✅ Compte créé avec succès !');
          this.router.navigateByUrl('/login');
        } else {
          this.errorMessage = "Échec de l'inscription.";
          this.loading = false;
        }
      },
      error: () => {
        this.errorMessage = "Erreur lors de l'inscription.";
        this.loading = false;
      },
    });
  }
}
