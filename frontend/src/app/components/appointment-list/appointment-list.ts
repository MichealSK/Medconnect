import { Component, input } from '@angular/core';

import { AppointmentResponse } from '../../services/appointments';
import {
  AppointmentRowComponent,
  AppointmentRowMode,
  AppointmentRowVariant,
} from '../appointment-data/appointment-data';

@Component({
  selector: 'app-appointment-list',
  imports: [AppointmentRowComponent],
  host: { class: 'block' },

  templateUrl: './appointment-list.html',
})
export class AppointmentListComponent {
  title = input.required<string>();
  appointments = input.required<AppointmentResponse[]>();
  mode = input.required<AppointmentRowMode>();
  variant = input.required<AppointmentRowVariant>();
  emptyMessage = input<string>('No appointments found');
}
