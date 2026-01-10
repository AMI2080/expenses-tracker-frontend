import { Component } from '@angular/core';

@Component({
  selector: 'app-hamburger-icon',
  standalone: true,
  template: `
    <svg
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  `,
})
export class HamburgerIconComponent {}

