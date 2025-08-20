import { Routes } from '@angular/router';

// Auth
import { LoginComponent } from './view/auth/login-component/login-component';
import { RegisterComponent } from './view/auth/register-component/register-component';

// Layout
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// Client Pages
import { HomePageComponent } from './view/pages/home/home.component';
import { DocumentLibraryComponent } from './view/pages/document-library/document-library.component';
import { DocumentViewerComponent } from './view/pages/document-viewer/document-viewer.component';
import { VideoLibraryComponent } from './view/pages/video-library/video-library.component';
import { VideoViewerComponent } from './view/pages/video-viewer/video-viewer.component';
import { BlogListComponent } from './view/pages/blog-list/blog-list.component';
import { BlogPostComponent } from './view/pages/blog-post/blog-post.component';
import { SubscriptionPageComponent } from './view/pages/subscription-page/subscription-page.component';
import { UserProfileComponent } from './view/pages/user-profile/user-profile.component';
import { AbllsTaskListComponent } from './view/pages/ablls-task-list/ablls-task-list.component';
import { AbllsTaskByCodeComponent } from './view/pages/ablls-task-by-code/ablls-task-by-code.component';
import { AbllsTaskDetailsComponent } from './view/pages/ablls-task-details/ablls-task-details.component';
import { MaterialListComponent } from './view/pages/material-list/material-list.component';
import { EvaluationCriteriaDetailsComponent } from './view/pages/evaluation-criteria-details/evaluation-criteria-details.component';
import { BaselineContentListComponent } from './view/pages/baseline-list/baseline-content-list.component';

// Admin Pages
import { AdminDashboardComponent } from './view/pages/admin-dashboard/admin-dashboard.component';
import { AdminUserFormComponent } from './view/pages/admin-dashboard/admin-user-form/admin-user-form.component';
import { CategoryListComponent } from './view/pages/category-list/category-list.component';
import { AddCategoryComponent } from './view/pages/add-category/add-category.component';
import { AddDomainComponent } from './view/pages/add-domain/add-domain.component';
import { AbllsTaskAdminComponent } from './view/pages/ablls-task-admin/ablls-task-admin.component';
import { AddAbllsTaskComponent } from './view/pages/add-ablls-task/add-ablls-task.component';
import { AddMaterialPhotoComponent } from './view/pages/add-material-photo/add-material-photo.component';
import { AddBaselineContentComponent } from './view/pages/add-baseline-content/add-baseline-content.component';
import { AddVideoComponent } from './view/pages/add-video/add-video.component';
import { AddDocumentComponent } from './view/pages/add-document/add-document.component';
import { BlogEditorComponent } from './view/pages/blog-editor/blog-editor.component';
import { VideoListComponent } from './view/pages/video-list/video-list.component';
import { AdminDocumentsComponent } from './view/pages/admin-dashboard/admin-documents/admin-documents.component';

// Guards
import { authGuard } from './services/auth/guard/auth.guard';
import { adminGuard } from './services/auth/guard/admin.guard';
import { AddResourceCategoryComponent } from './view/pages/add-resource-category/add-resource-category.component';
import { ResourceCategoryListComponent } from './view/pages/resource-category/resource-category-list.component';
import { DomainListComponent } from './view/pages/domain-list/domain-list.component';
import { BaselineContentViewerComponent } from './view/pages/baseline-content-viewer/baseline-content-viewer.component';
import { BaselineContentCardsComponent } from './view/pages/baseline-content-cards/baseline-content-cards.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // Client
      { path: 'home', component: HomePageComponent },
      { path: 'documents', component: DocumentLibraryComponent },
      { path: 'documents/:id/view', component: DocumentViewerComponent },
      { path: 'videos', component: VideoLibraryComponent },
      { path: 'videos/:id/view', component: VideoViewerComponent },
      { path: 'bloglist', component: BlogListComponent },
      { path: 'blog/:id', component: BlogPostComponent },
      { path: 'subscription', component: SubscriptionPageComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'taches', component: AbllsTaskListComponent },
      { path: 'ablls', component: AbllsTaskByCodeComponent },
      { path: 'ablls-task/:id', component: AbllsTaskDetailsComponent },
      { path: 'evaluation-criteria/:id', component: EvaluationCriteriaDetailsComponent },
      { path: 'baseline/view/:id', component : BaselineContentViewerComponent},
      { path: 'baselines' , component: BaselineContentCardsComponent},
      {
  path: 'baseline/task/:id',
  component: BaselineContentViewerComponent
},

      // Admin
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          { path: '', component: AdminDashboardComponent },
          { path: 'users/create', component: AdminUserFormComponent },
          { path: 'categories', component: CategoryListComponent },
          { path: 'category/new', component: AddCategoryComponent },
          { path: 'domains/new', component: AddDomainComponent },
          { path: 'ablls', component: AbllsTaskAdminComponent },
          { path: 'ablls/new', component: AddAbllsTaskComponent },
          { path: 'material', component: MaterialListComponent },
          { path: 'material/new', component: AddMaterialPhotoComponent },
          { path: 'baselines', component: BaselineContentListComponent },
          { path: 'documents' , component : AdminDocumentsComponent},
          { path: 'domaines' , component: DomainListComponent},
          { path: 'baseline/new', component: AddBaselineContentComponent },
          { path: 'videos/new', component: AddVideoComponent },
          { path: 'documents/new', component: AddDocumentComponent },
          { path: 'blogEditor', component: BlogEditorComponent },
          { path: 'videoList', component: VideoListComponent },
          { path: 'resource-categories', component: ResourceCategoryListComponent },
          { path: 'resource-categories/new' , component: AddResourceCategoryComponent }
        ]
      }
    ]
  }
];
