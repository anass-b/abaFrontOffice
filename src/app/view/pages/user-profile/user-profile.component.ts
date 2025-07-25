import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth/auth.service';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
import { SharedService } from '../../../services/shared/shared.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  subService = inject(SubscriptionService);
  shared = inject(SharedService);
  userService = inject(UserService);

  userForm!: FormGroup;
  currentUser: User | null = null;
  subscriptionInfo: any = null;
  loading = false;

  ngOnInit(): void {
  const userFromToken = this.auth.getCurrentUser();
  if (!userFromToken) return;

  this.userService.getUserById(userFromToken.id!).subscribe({
    next: (fullUser) => {
      this.currentUser = fullUser;

      this.userForm = this.fb.group({
        email: [{ value: fullUser?.email, disabled: true }],
        firstName: [fullUser?.firstName, Validators.required],
        lastName: [fullUser?.lastName, Validators.required],
        phoneNumber: [fullUser?.phoneNumber]
      });

      this.loadSubscription();
    },
    error: () => {
      this.shared.displaySnackBar("Erreur lors du chargement du profil.");
    }
  });
}


  loadSubscription() {
    if (!this.currentUser) return;
    this.subService.getSubscriptionsByUserId(this.currentUser.id!).subscribe({
      next: sub => this.subscriptionInfo = sub,
      error: () => this.subscriptionInfo = null
    });
  }

  onUpdate(): void {
    if (!this.userForm.valid || !this.currentUser) return;
    const updated = {
      ...this.currentUser,
      ...this.userForm.value
    };

    this.loading = true;
    this.userService.updateUser(this.currentUser.id!, updated).subscribe({
      next: (user) => {
        this.shared.displaySnackBar('Profil mis à jour avec succès ✅');
        this.loading = false;
      },
      error: () => {
        this.shared.displaySnackBar("Erreur lors de la mise à jour.");
        this.loading = false;
      }
    });
  }
}
