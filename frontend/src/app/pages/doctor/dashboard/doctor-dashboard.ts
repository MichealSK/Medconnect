import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthStateService } from '../../../auth/services/auth-state';
import { AppointmentsService } from '../../../services/appointments';
import { ProfileCardComponent } from '../../../components/profile-card/profile-card';
import { FullNamePipe } from '../../../shared/pipes/doctor-full-name-pipe';

import { HelpCardComponent } from '../../../ui/help-card';

import { StatCardComponent } from '../../../ui/stat-card';
import { ForumActivityComponent } from '../../../components/forum-activity/forum-activity';
import { provideIcons, NgIcon } from '@ng-icons/core';

import { AppointmentListComponent } from '../../../components/appointment-list/appointment-list';
import { heroClock } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [
    RouterModule,
    ProfileCardComponent,
    FullNamePipe,
    HelpCardComponent,
    StatCardComponent,
    ForumActivityComponent,
    AppointmentListComponent,
    NgIcon,
  ],
  providers: [provideIcons({ heroClock })],
  templateUrl: './doctor-dashboard.html',
})
export class DoctorDashboardComponent {
  private authState = inject(AuthStateService);
  private appointmentsService = inject(AppointmentsService);

  user = this.authState.currentUser;

  today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  appointments = toSignal(this.appointmentsService.getAll(), { initialValue: [] });

  todayAppointments = computed(() => {
    const today = new Date().toDateString();
    return this.appointments()
      .filter((a) => new Date(a.scheduledAt).toDateString() === today)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  });

  upcomingAppointments = computed(() => {
    const now = new Date();
    return this.appointments()
      .filter((a) => a.status === 'CONFIRMED' && new Date(a.scheduledAt) > now)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 5);
  });

  pastAppointments = computed(() => {
    return this.appointments()
      .filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED')
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  });

  todayCount = computed(() => this.todayAppointments().length);
  upcomingCount = computed(() => this.upcomingAppointments().length);
  completedCount = computed(
    () => this.appointments().filter((a) => a.status === 'COMPLETED').length,
  );
}
