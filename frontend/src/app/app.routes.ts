import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';
import { Role } from './auth/models/user';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'doctors/:id',
    loadComponent: () =>
      import('./pages/doctors/[id]/doctor-details').then((m) => m.DoctorDetailComponent),
  },
  {
    path: 'patient/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/patient/dashboard/patient-dashboard').then(
        (m) => m.PatientDashboardComponent,
      ),
  },
  {
    path: 'doctor/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.DOCTOR] },
    loadComponent: () =>
      import('./pages/doctor/dashboard/doctor-dashboard').then((m) => m.DoctorDashboardComponent),
  },
  {
    path: 'patient/appointments/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.PATIENT] },
    loadComponent: () =>
      import('./pages/patient/appointments/patient-appointment-detail').then(
        (m) => m.PatientAppointmentDetailComponent,
      ),
  },
  {
    path: 'doctor/appointments/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.DOCTOR] },
    loadComponent: () =>
      import('./pages/doctor/appointments/doctor-appointment-detail').then(
        (m) => m.DoctorAppointmentDetailComponent,
      ),
  },
  {
    path: 'doctor/availability',
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.DOCTOR] },
    loadComponent: () =>
      import('./pages/doctor/availability/doctor-availability').then(
        (m) => m.DoctorAvailabilityComponent,
      ),
  },
  {
    path: 'doctors',
    loadComponent: () => import('./pages/doctors/doctors').then((m) => m.DoctorsComponent),
  },
  {
    path: 'meeting/:roomName',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/meeting/meeting').then((m) => m.MeetingComponent),
  },
  {
    path: 'forum',
    loadComponent: () => import('./pages/forum/forum').then((m) => m.ForumComponent),
  },
  {
    path: 'forum/:id',
    loadComponent: () =>
      import('./pages/forum/[id]/post-detail').then((m) => m.PostDetailComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
