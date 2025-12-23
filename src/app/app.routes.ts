import { Routes } from '@angular/router';
import { guestGuard } from './guards/guest.guard';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
    canActivate: [guestGuard]
  }
];
