import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { environment } from '@env/environment';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    user: UserDetails;
    token: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  errors?: Record<string, string[]>;
  message?: string;
}

export interface UserDetails {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_approved: boolean;
  is_verified_email: boolean;
  sessions?: Array<{
    id: number;
    name: string;
    is_current: boolean;
    last_used_at?: string;
    expires_at?: string;
    created_at: string;
  }>;
}

export interface UserDetailsResponse {
  success: boolean;
  data: UserDetails;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly router = inject(Router);

  currentUser = signal<UserDetails | null>(null);

  constructor(private readonly http: HttpClient) {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        if (response?.success && response.data?.token) {
          localStorage.setItem('token', response.data.token);

          if (response.data.user) {
            this.currentUser.set(response.data.user);
          }
        }
      })
    );
  }

  /**
   * Fetch and store current user details from the API
   */
  getUserDetails(): Observable<UserDetailsResponse> {
    return this.http.get<UserDetailsResponse>(`${this.apiUrl}/user`).pipe(
      tap((response) => {
        if (response?.success && response.data) {
          this.currentUser.set(response.data);
        }
      })
    );
  }

  /**
   * Logout user by invalidating token on server and clearing local data
   */
  logout(): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(`${this.apiUrl}/logout`, {})
      .pipe(
        finalize(() => {
          localStorage.removeItem('token');
          this.currentUser.set(null);
          this.router.navigate(['/']);
        })
      );
  }
}
