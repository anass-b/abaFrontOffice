import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router ,RouterLink} from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';
import { LoginData } from '../../../models/auth/login-data.model';
import { SharedService } from '../../../services/shared/shared.service';
import { SubscriptionService } from '../../../services/subscription/subscription.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , RouterLink],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss']
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  shared = inject(SharedService);
  subscriptionService = inject(SubscriptionService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  errorMessage = '';
  showPassword = false;
  loading = false;

  ngOnInit(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;

    const credentials: LoginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.auth.login(credentials).subscribe({
      next: (res) => {
  const authData = {
    token: res.token,
    refreshToken: res.refreshToken
  };
  
  this.auth.updateCurrentUser(authData); // ✅ maintenant il déclenche bien isAdminSubject
  
  // ✅ récupérer et stocker l'abonnement actif
  const user = this.auth.getCurrentUser(); // ce user contient isAdmin maintenant
  this.subscriptionService.fetchAll().subscribe(allSubs => {
    this.auth.userSubscription = allSubs.find(s =>
      s.userId === user?.id && s.isActive && s.type === 'PREMIUM'
    ) || null;

    this.router.navigateByUrl('/home'); // ✅ après chargement
  });
},
      error: () => {
        this.errorMessage = "Email ou mot de passe incorrect.";
        this.shared.displaySnackBar(this.errorMessage);
        this.loading = false;
      }
    });
  }
}
