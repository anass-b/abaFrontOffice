import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-subscription-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-page.component.html',
  styleUrls: ['./subscription-page.component.scss']
})
export class SubscriptionPageComponent {
  subscriptionService = inject(SubscriptionService);
  authService = inject(AuthService);
  router = inject(Router);

  selectedPlan: 'BASIC' | 'PREMIUM' | null = null;
  isSubmitting = false;
  successMessage = '';

  // formulaire simulé
  paymentInfo = {
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  };

  submitSubscription() {
  const user = this.authService.getCurrentUser();
  if (!user || !this.selectedPlan) return;

  this.isSubmitting = true;

  const now = new Date();
  const end = new Date();
  end.setMonth(now.getMonth() + 1); // +1 mois

  const isActive = this.selectedPlan === 'PREMIUM';

  this.subscriptionService.addSubscription({
    userId: user.id,
    type: this.selectedPlan,
    startDate: now.toISOString(),
    endDate: end.toISOString(),
    isActive: isActive
  }).subscribe(() => {
    this.isSubmitting = false;
    this.successMessage = 'Votre demande d’abonnement a bien été enregistrée ✅';
    this.selectedPlan = null;
    this.paymentInfo = { cardHolder: '', cardNumber: '', expiry: '', cvc: '' };
  });
}

}
