import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthStateService } from './auth-state';
import { Router } from '@angular/router';
import { environments } from '../../../environments/environment';
import { LoginRequest } from '../models/login-request';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response';

import { User } from '../models/user';
import { DoctorRegisterRequest, PatientRegisterRequest } from '../models/register-request';
import { UserResponse } from '../models/user-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environments.apiUrl}/auth`;

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((response) => {
        const user: User = {
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role,
          emailVerified: response.emailVerified,
        };
        this.authState.setSession(response.accessToken, user);
      }),
    );
  }
  registerPatient(payload: PatientRegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, payload);
  }

  registerDoctor(payload: DoctorRegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register/doctor`, payload);
  }
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { responseType: 'text' }).pipe(
      tap({
        complete: () => this.authState.clear(),
        error: () => this.authState.clear(),
      }),
    );
  }
  verifyEmail(token: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/verify-email`, {
      params: new HttpParams().set('token', token),
      responseType: 'text',
    });
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, null, {
      params: new HttpParams().set('email', email),
    });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, null, {
      params: new HttpParams().set('token', token).set('newPassword', newPassword),
    });
  }
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${this.baseUrl}/refresh`, {}, { withCredentials: true })
      .pipe(tap((response) => this.authState.updateToken(response.accessToken)));
  }
  requireAuth(returnUrl: string): boolean {
    if (!this.authState.isLoggedIn) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl } }).then(()=>{});
      return false;
    }
    return true;
  }
  updateProfile(request: { firstName: string; lastName: string }) {
    return this.http.put<UserResponse>(`${this.baseUrl}/me`, request);
  }

  changePassword(request: { currentPassword: string; newPassword: string }) {
    return this.http.put<void>(`${this.baseUrl}/change-password`, request);
  }
}
