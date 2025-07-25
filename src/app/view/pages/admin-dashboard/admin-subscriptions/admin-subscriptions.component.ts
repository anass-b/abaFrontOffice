import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from '../../../../models/subscription.model';
import { SubscriptionService } from '../../../../services/subscription/subscription.service';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-subscriptions.component.html',
  styleUrls: ['./admin-subscriptions.component.scss']
})
export class AdminSubscriptionsComponent implements OnInit {
  subscriptionService = inject(SubscriptionService);
  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subscriptionService.fetchAll().subscribe(data => {
      this.subscriptions = data;
    });
  }

  deleteSubscription(id: number | undefined) {
    if (!id) return;
    if (confirm('Supprimer cet abonnement ?')) {
      this.subscriptionService.deleteSubscription(id).subscribe(() => {
        this.loadSubscriptions();
      });
    }
  }
}
