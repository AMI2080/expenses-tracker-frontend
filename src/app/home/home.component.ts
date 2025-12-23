import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, type UserDetails } from '@app/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  get currentUser(): UserDetails | null {
    return this.authService.currentUser();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
