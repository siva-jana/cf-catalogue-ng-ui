import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
 
export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    {
    path: 'category/:name',
    loadComponent: () => import('./category-page/category-page.component').then(m => m.CategoryPageComponent)
  },
  {
    path: 'view/:category/:filename',
    loadComponent: () =>
      import('./file-viewer/file-viewer.component').then(m => m.FileViewerComponent)
  }
];