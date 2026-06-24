import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar';
import { StatusBadgeComponent } from '../../ui/status-badge';
import { FullNamePipe } from '../../shared/pipes/doctor-full-name-pipe';
import { AppointmentResponse } from '../../services/appointments';

export type AppointmentRowMode = 'patient' | 'doctor';
export type AppointmentRowVariant = 'upcoming' | 'past' | 'today';

@Component({
  selector: 'app-appointment-row',
  imports: [
    RouterLink,
    DatePipe,
    TitleCasePipe,
    AvatarComponent,
    StatusBadgeComponent,
    FullNamePipe,
  ],
  templateUrl: './appointment-data.html',
})
export class AppointmentRowComponent {
  appointment = input.required<AppointmentResponse>();
  mode = input.required<AppointmentRowMode>();
  variant = input.required<AppointmentRowVariant>();

  badgeStatus() {
    const status = this.appointment().status;
    if (status === 'CONFIRMED') return 'confirmed';
    if (status === 'COMPLETED') return 'completed';
    return 'cancelled';
  }

  canJoin() {
    const status = this.appointment().status;
    return this.variant() === 'upcoming' || (this.variant() === 'today' && status === 'CONFIRMED');
  }

  viewRoute() {
    const id = this.appointment().id;
    return this.mode() === 'patient' ? `/patient/appointments/${id}` : `/doctor/appointments/${id}`;
  }
}
