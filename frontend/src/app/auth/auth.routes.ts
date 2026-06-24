import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'verify',
    loadComponent: () => import('./pages/verify-email/verify-email').then((m) => m.VerifyEmail),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password').then((m) => m.ResetPassword),
  },
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
];
