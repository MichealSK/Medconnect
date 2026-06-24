import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthStateService } from '../../../auth/services/auth-state';
import { AppointmentsService } from '../../../services/appointments';
import { ProfileCardComponent } from '../../../components/profile-card/profile-card';
import { ForumActivityComponent } from '../../../components/forum-activity/forum-activity';
import { FullNamePipe } from '../../../shared/pipes/doctor-full-name-pipe';
import { HelpCardComponent } from '../../../ui/help-card';
import { StatCardComponent } from '../../../ui/stat-card';
import { AppointmentListComponent } from '../../../components/appointment-list/appointment-list';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-patient-dashboard',
  imports: [
    RouterModule,
    ProfileCardComponent,
    ForumActivityComponent,
    FullNamePipe,
    HelpCardComponent,
    StatCardComponent,
    AppointmentListComponent,
    TitleCasePipe,
    DatePipe,
  ],
  templateUrl: './patient-dashboard.html',
})
export class PatientDashboardComponent {
  private authState = inject(AuthStateService);
  private appointmentsService = inject(AppointmentsService);

  user = this.authState.currentUser;

  appointments = toSignal(this.appointmentsService.getAll(), { initialValue: [] });

  todayAppointment = computed(() => {
    const today = new Date().toDateString();
    return (
      this.appointments().find(
        (a) => a.status === 'CONFIRMED' && new Date(a.scheduledAt).toDateString() === today,
      ) ?? null
    );
  });

  upcomingAppointments = computed(() => {
    const now = new Date();
    return this.appointments()
      .filter((a) => a.status === 'CONFIRMED' && new Date(a.scheduledAt) > now)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  });

  pastAppointments = computed(() => {
    return this.appointments()
      .filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED')
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  });
  uniqueDoctors = computed(() => new Set(this.appointments().map((a) => a.doctorId)).size);
}
