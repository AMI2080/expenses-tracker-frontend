import {
  Component,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { form, Field, required, email } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, ApiErrorResponse } from '../auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [
    Field,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    // Email validation
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });

    // Password validation
    required(schemaPath.password, { message: 'Password is required' });
  });

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.loginForm().valid()) {
      this.markAllFieldsAsTouched();
      return;
    }

    const formData = this.loginModel();
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.cdr.detectChanges();

    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    this.authService
      .login(loginData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = 'Login failed. Please try again.';

          if (error.error) {
            const apiError = error.error as ApiErrorResponse;
            if (apiError.errors) {
              const firstErrorKey = Object.keys(apiError.errors)[0];
              errorMsg = apiError.errors[firstErrorKey]?.[0] || errorMsg;
            } else if (apiError.message) {
              errorMsg = apiError.message;
            }
          } else if (error.message) {
            errorMsg = error.message;
          }

          this.errorMessage.set(errorMsg);
          this.snackBar.open(errorMsg, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });

          return of(null);
        }),
        finalize(() => {
          this.isLoading.set(false);
          this.cdr.detectChanges();
        })
      )
      .subscribe((response) => {
        if (response?.success && response.data) {
          this.snackBar.open(response.message || 'Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });

          this.router.navigate(['']);
        }
      });
  }

  markAllFieldsAsTouched() {
    setTimeout(() => {
      const inputs = document.querySelectorAll('input[matInput]');
      inputs.forEach((input) => {
        (input as HTMLInputElement).focus();
        (input as HTMLInputElement).blur();
      });
      this.cdr.detectChanges();
    }, 0);
  }
}
