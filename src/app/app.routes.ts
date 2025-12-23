import { Routes } from '@angular/router';
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  }
];
