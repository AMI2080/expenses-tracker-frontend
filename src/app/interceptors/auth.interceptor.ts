import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  // Clone request with auth header if token exists
  const authRequest = token
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : request;

  return next(authRequest).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized responses globally
      if (error.status === 401) {
        authService.logout().subscribe();
      }
      return throwError(() => error);
    })
  );
};

