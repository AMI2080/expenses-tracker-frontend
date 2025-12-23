import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, type UserDetails } from '@app/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  get currentUser(): UserDetails | null {
    return this.authService.currentUser();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}

