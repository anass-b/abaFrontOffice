import { Routes } from '@angular/router';
import { LoginComponent } from './view/auth/login-component/login-component';
import { RegisterComponent } from './view/auth/register-component/register-component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DocumentLibraryComponent } from './view/pages/document-library/document-library.component';
import { AddDocumentComponent } from './view/pages/add-document/add-document.component';
import { authGuard } from './services/auth/guard/auth.guard';
import { HomePageComponent } from './view/pages/home/home.component'; // Assuming you have a HomePageComponent
import { VideoLibraryComponent } from './view/pages/video-library/video-library.component';
import { AddVideoComponent } from './view/pages/add-video/add-video.component';
import { BlogListComponent } from './view/pages/blog-list/blog-list.component';
import { BlogEditorComponent } from './view/pages/blog-editor/blog-editor.component';
import { BlogPostComponent } from './view/pages/blog-post/blog-post.component';
import { SubscriptionPageComponent } from './view/pages/subscription-page/subscription-page.component';
import { DocumentViewerComponent } from './view/pages/document-viewer/document-viewer.component';
import { VideoViewerComponent } from './view/pages/video-viewer/video-viewer.component';
import { AdminDashboardComponent } from './view/pages/admin-dashboard/admin-dashboard.component';
import { AdminUserFormComponent } from './view/pages/admin-dashboard/admin-user-form/admin-user-form.component';
import { UserProfileComponent } from './view/pages/user-profile/user-profile.component';
import { AbllsTaskListComponent } from './view/pages/ablls-task-list/ablls-task-list.component';
import { AddAbllsTaskComponent } from './view/pages/add-ablls-task/add-ablls-task.component';
import { AddMaterialPhotoComponent } from './view/pages/add-material-photo/add-material-photo.component';
import { AbllsTaskDetailsComponent } from './view/pages/ablls-task-details/ablls-task-details.component';
import { EvaluationCriteriaDetailsComponent } from './view/pages/evaluation-criteria-details/evaluation-criteria-details.component';
import { MaterialListComponent } from './view/pages/material-list/material-list.component';
import { AbllsTaskByCodeComponent } from './view/pages/ablls-task-by-code/ablls-task-by-code.component';
import { AddBaselineContentComponent } from './view/pages/add-baseline-content/add-baseline-content.component';
import { BaselineContentListComponent } from './view/pages/baseline-list/baseline-content-list.component';
import { AddDomainComponent } from './view/pages/add-domain/add-domain.component';
import { AddCategoryComponent} from './view/pages/add-category/add-category.component';
import { AbllsTaskAdminComponent } from './view/pages/ablls-task-admin/ablls-task-admin.component';
import { CategoryListComponent } from './view/pages/category-list/category-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // ✅ redirection par défaut
      { path: 'home', component: HomePageComponent },
      { path: 'documents', component: DocumentLibraryComponent },
      { path: 'documents/new', component: AddDocumentComponent },
      { path: 'documents/:id/view', component: DocumentViewerComponent}, // ✅ Affichage du document
      { path: 'videos', component: VideoLibraryComponent },
      { path: 'videos/new', component: AddVideoComponent },
      { path: 'videos/:id/view', component: VideoViewerComponent },
      { path: 'bloglist', component: BlogListComponent },
      { path: 'blogEditor', component: BlogEditorComponent },
      { path: 'blog/:id', component: BlogPostComponent },
      { path: 'subscription', component: SubscriptionPageComponent },
      { path: 'admin' , component:AdminDashboardComponent},
      { path: 'admin/users/create' , component: AdminUserFormComponent},
      { path: 'profile' , component : UserProfileComponent} ,
      { path: 'taches' , component:AbllsTaskListComponent},
      { path: 'domaines/new' , component : AddDomainComponent },
      { path: 'ablls', component: AbllsTaskByCodeComponent},
      { path: 'ablls/new' , component : AddAbllsTaskComponent},
      { path:'ablls-task/:id', component: AbllsTaskDetailsComponent},
      { path:'material' , component:MaterialListComponent},
      { path: 'material/new' , component : AddMaterialPhotoComponent},
      { path: 'evaluation-criteria/:id', component: EvaluationCriteriaDetailsComponent },
      { path: 'baseline/new' , component:AddBaselineContentComponent},
      { path: 'baselines' , component : BaselineContentListComponent},
      { path: 'categories' , component : CategoryListComponent},
      { path: 'category/new' , component : AddCategoryComponent},
      { path:'ablls-admin', component: AbllsTaskAdminComponent},


    ]
  }
];

