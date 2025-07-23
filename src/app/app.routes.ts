import { Routes } from '@angular/router';
import { LoginComponent } from './view/auth/login-component/login-component';
import { RegisterComponent } from './view/auth/register-component/register-component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DocumentLibraryComponent } from './view/pages/document-library/document-library.component';
import { AddDocumentComponent } from './view/pages/add-document/add-document.component';
//import { authGuard } from './guards/auth.guard';
import { HomePageComponent } from './view/pages/home/home.component'; // Assuming you have a HomePageComponent
import { VideoLibraryComponent } from './view/pages/video-library/video-library.component';
import { AddVideoComponent } from './view/pages/add-video/add-video.component';
import { BlogListComponent } from './view/pages/blog-list/blog-list.component';
import { BlogEditorComponent } from './view/pages/blog-editor/blog-editor.component';
import { BlogPostComponent } from './view/pages/blog-post/blog-post.component';
import { SubscriptionPageComponent } from './view/pages/subscription-page/subscription-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // ✅ redirection par défaut
      { path: 'home', component: HomePageComponent },
      { path: 'documents', component: DocumentLibraryComponent },
      { path: 'documents/new', component: AddDocumentComponent },
      { path: 'videos', component: VideoLibraryComponent },
      { path: 'videos/new', component: AddVideoComponent },
      { path: 'bloglist', component: BlogListComponent },
      { path: 'blogEditor', component: BlogEditorComponent },
      { path: 'blog/:id', component: BlogPostComponent },
      { path: 'subscription', component: SubscriptionPageComponent }
    ]
  }
];

