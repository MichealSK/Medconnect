import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthStateService } from '../../auth/services/auth-state';
import { AuthService } from '../../auth/services/auth-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { NotificationResponse, NotificationsService } from '../../services/notifications';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TitleCasePipe, DatePipe],
  templateUrl: './navbar.html',
})
export class Navbar {
  readonly authState = inject(AuthStateService);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  private notificationsService = inject(NotificationsService);

  dropdownOpen = false;
  notificationsOpen = false;
  refresh = signal(0);
  private refresh$ = toObservable(this.refresh);

  notifications = toSignal(
    this.authState._currentUser.pipe(
      switchMap((user) => {
        if (!user) return of([] as NotificationResponse[]);
        return this.refresh$.pipe(switchMap(() => this.notificationsService.getAll()));
      }),
    ),
    { initialValue: [] as NotificationResponse[] },
  );

  unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  markAsRead(id: string, event: Event) {
    event.stopPropagation();
    this.notificationsService.markAsRead(id).subscribe(() => {
      this.refresh.update((r) => r + 1);
    });
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe(() => {
      this.refresh.update((r) => r + 1);
    });
  }

  logout() {
    this.authService.logout().subscribe({
      complete: () => {
        this.dropdownOpen = false;
        this.router.navigate(['/auth/login']).then(() => {
          window.location.reload();
        });
      },
    });
  }

  get dashboardRoute(): string | null {
    const role = this.authState.currentUser?.role;
    if (role === 'DOCTOR') return '/doctor/dashboard';
    if (role === 'PATIENT') return '/patient/dashboard';
    return null;
  }
}
