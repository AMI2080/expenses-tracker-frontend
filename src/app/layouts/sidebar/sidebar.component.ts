import { Component, Input, Output, EventEmitter, inject, Type } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, type UserDetails } from '@app/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import {
  DashboardIconComponent,
  ExpensesIconComponent,
  GroupsIconComponent,
  HamburgerIconComponent,
  SignOutIconComponent,
} from '@app/shared/icons';
import { ExpenseGroupSelectorComponent } from './expense-group-selector/expense-group-selector.component';

interface NavigationItem {
  route: string | string[];
  label: string;
  icon: Type<Component>;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    NgComponentOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    HamburgerIconComponent,
    SignOutIconComponent,
    ExpenseGroupSelectorComponent,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly navigationItems: NavigationItem[] = [
    {
      route: ['dashboard'],
      label: 'Dashboard',
      icon: DashboardIconComponent,
    },
    {
      route: ['expenses'],
      label: 'Expenses',
      icon: ExpensesIconComponent,
    },
    {
      route: ['groups'],
      label: 'Groups',
      icon: GroupsIconComponent,
    },
  ];

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

