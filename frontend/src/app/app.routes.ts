import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MapComponent } from './pages/map/map';
import { NotificationsComponent } from './pages/notifications/notifications';
import { ChatPageComponent } from './pages/chat-page/chat-page';
import { ProfileComponent } from './pages/profile/profile';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'map', component: MapComponent, canActivate: [authGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },
  { path: 'chat/:id', component: ChatPageComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
