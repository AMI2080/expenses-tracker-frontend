import { Injectable, signal } from '@angular/core';

export interface ExpenseGroup {
  id: string;
  name: string;
  owner_id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupService {
  private readonly staticExpenseGroups: ExpenseGroup[] = [
    { id: '1', name: 'Marketing Team' },
    { id: '2', name: 'Sales Department' },
    { id: '3', name: 'IT Division' },
    { id: '4', name: 'HR Group' },
    { id: '5', name: 'Operations' },
  ];

  currentExpenseGroup = signal<ExpenseGroup | null>(null);
  availableExpenseGroups = signal<ExpenseGroup[]>(this.staticExpenseGroups);

  constructor() {
    if (this.staticExpenseGroups.length > 0) {
      this.currentExpenseGroup.set(this.staticExpenseGroups[0]);
    }
  }

  setCurrentExpenseGroup(id: string): void {
    const group = this.staticExpenseGroups.find((g) => g.id === id);
    if (group) {
      this.currentExpenseGroup.set(group);
    }
  }
}
