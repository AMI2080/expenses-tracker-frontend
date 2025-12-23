import {
  Component,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  form,
  Field,
  required,
  email,
  minLength,
  validate,
  customError,
} from '@angular/forms/signals';
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

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  imports: [
    Field,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerModel = signal<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.registerModel, (schemaPath) => {
    // Name validation
    required(schemaPath.name, { message: 'Name is required' });

    // Email validation
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });

    // Password validation
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, {
      message: 'Password must be at least 8 characters long',
    });

    // Confirm password validation
    required(schemaPath.confirmPassword, {
      message: 'Please confirm your password',
    });
    validate(schemaPath.confirmPassword, (ctx) => {
      const passwordValue = ctx.valueOf(schemaPath.password);
      if (ctx.value() !== passwordValue) {
        return customError({ message: 'Passwords do not match' });
      }
      return undefined;
    });
  });

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.registerForm().valid()) {
      this.markAllFieldsAsTouched();
      return;
    }

    const formData = this.registerModel();
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.cdr.detectChanges();

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    };

    this.authService
      .register(registerData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = 'Registration failed. Please try again.';

          if (error.error) {
            const apiError = error.error as ApiErrorResponse;
            if (apiError.errors) {
              // Extract first error message from validation errors
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
        if (response?.success) {
          this.snackBar.open(
            response.message ||
              'Registration successful! Please check your email to verify your account.',
            'Close',
            {
              panelClass: ['success-snackbar'],
            }
          );

          setTimeout(() => {
            this.router.navigate(['']);
          }, 2000);
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
