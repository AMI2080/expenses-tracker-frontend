import {
  Component,
  inject,
  signal,
  HostListener,
  computed,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  ExpenseGroupService,
  type ExpenseGroup,
} from '@app/services/expense-group.service';
import { CheckIconComponent } from '@app/shared/icons';

@Component({
  selector: 'app-expense-group-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, CheckIconComponent],
  templateUrl: './expense-group-selector.component.html',
})
export class ExpenseGroupSelectorComponent {
  @Input()
  public isCollapsed = false;

  private readonly expenseGroupService = inject(ExpenseGroupService);

  public isMenuOpen = signal<boolean>(false);
  public currentExpenseGroup = this.expenseGroupService.currentExpenseGroup;
  public availableExpenseGroups =
    this.expenseGroupService.availableExpenseGroups;

  public currentGroupName = computed<string>(() => {
    const current = this.currentExpenseGroup();
    return current ? current.name : 'Select Group';
  });

  public currentGroupAbbreviation = computed<string>(() => {
    const current = this.currentExpenseGroup();
    if (!current?.name) {
      return 'SG';
    }

    const words = current.name.trim().split(/\s+/);

    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    } else {
      return words[0].substring(0, 2).toUpperCase();
    }
  });

  public toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  public showSelector = computed<boolean>(() => {
    return this.availableExpenseGroups().length > 1;
  });

  public selectExpenseGroup(group: ExpenseGroup): void {
    const current = this.currentExpenseGroup();
    if (current && current.id === group.id) {
      return;
    }

    this.expenseGroupService.setCurrentExpenseGroup(group.id);
    this.isMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  public onEscapeKey(): void {
    this.isMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.expense-group-selector')) {
      this.isMenuOpen.set(false);
    }
  }
}
