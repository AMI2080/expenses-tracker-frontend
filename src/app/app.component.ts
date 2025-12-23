import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService, type UserDetails } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getUserDetails().subscribe();
    }
  }
}
