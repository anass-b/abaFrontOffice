import { Component  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBlogsComponent } from './admin-blogs/admin-blogs.component';
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';
import { AdminDocumentsComponent } from './admin-documents/admin-documents.component';
import { AdminSubscriptionsComponent } from './admin-subscriptions/admin-subscriptions.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminVideosComponent } from './admin-videos/admin-videos.component';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [AdminBlogsComponent, AdminCategoriesComponent, AdminDocumentsComponent, AdminSubscriptionsComponent,
     AdminUsersComponent, AdminVideosComponent , CommonModule]
})
export class AdminDashboardComponent {
  tabs = [
    { label: 'Documents' },
    { label: 'Vidéos' },
    { label: 'Blogs' },
    { label: 'Abonnements' },
    { label: 'Utilisateurs' },
    { label: 'Catégories' }
  ];

  activeTab = 0;
}
