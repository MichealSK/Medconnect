import { Component, inject, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../../services/appointments';
import { AiBriefComponent } from '../../../ui/ai-breif';
import { BackLinkComponent } from '../../../ui/back-link';
import { BadgeStatus, StatusBadgeComponent } from '../../../ui/status-badge';
import { AvatarComponent } from '../../../ui/avatar';
import { SymptomFormViewComponent } from '../../../ui/symptom-form-view';
import { TitleCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-doctor-appointment-detail',
  imports: [
    RouterModule,
    FormsModule,
    AiBriefComponent,
    BackLinkComponent,
    StatusBadgeComponent,
    AvatarComponent,
    SymptomFormViewComponent,
    TitleCasePipe,
    DatePipe,
  ],
  templateUrl: './doctor-appointment-detail.html',
})
export class DoctorAppointmentDetailComponent {
  private route = inject(ActivatedRoute);
  private appointmentsService = inject(AppointmentsService);

  appointment = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('id')!),
      switchMap((id) => this.appointmentsService.getById(id)),
    ),
  );

  symptomForm = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('id')!),
      switchMap((id) =>
        this.appointmentsService.getSymptomForm(id).pipe(catchError(() => of(null))),
      ),
    ),
  );

  notes = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('id')!),
      switchMap((id) => this.appointmentsService.getNotes(id).pipe(catchError(() => of(null)))),
    ),
  );
  badgeStatus(): BadgeStatus {
    return this.appointment()!.status.toLowerCase() as BadgeStatus;
  }
  notesText = '';
  isSavingNotes = signal(false);
  notesSaved = signal(false);

  saveNotes() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!this.notesText.trim()) return;
    this.isSavingNotes.set(true);
    this.appointmentsService.saveNotes(id, { notesText: this.notesText }).subscribe({
      next: () => {
        this.isSavingNotes.set(false);
        this.notesSaved.set(true);
      },
      error: () => this.isSavingNotes.set(false),
    });
  }
}
