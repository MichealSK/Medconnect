import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state';
import { AuthService } from '../services/auth-service';

const PUBLIC_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
  '/api/auth/resend-verification',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authState = inject(AuthStateService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const isPublic = PUBLIC_ENDPOINTS.some((ep) => req.url.includes(ep));
  const token = authState.accessToken;

  let cloned = req.clone({ withCredentials: true });

  if (!isPublic && token) {
    cloned = cloned.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublic) {
        return handle401(cloned, next, authState, authService, router);
      }
      return throwError(() => error);
    }),
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authState: AuthStateService,
  authService: AuthService,
  router: Router,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshSubject.next(response.accessToken);

        return next(
          req.clone({
            withCredentials: true,
            setHeaders: { Authorization: `Bearer ${response.accessToken}` },
          }),
        );
      }),
      catchError((error) => {
        isRefreshing = false;
        authState.clear();
        router.navigate(['/auth/login'], { queryParams: { sessionExpired: true } }).then(() => {});
        return throwError(() => error);
      }),
    );
  }

  return refreshSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) =>
      next(
        req.clone({
          withCredentials: true,
          setHeaders: { Authorization: `Bearer ${token}` },
        }),
      ),
    ),
  );
}
