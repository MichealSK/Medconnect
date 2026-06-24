import { Component, inject, signal, computed } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../../services/appointments';
import { ReviewsService } from '../../../services/reviews';
import { FullNamePipe } from '../../../shared/pipes/doctor-full-name-pipe';
import { AiBriefComponent } from '../../../ui/ai-breif';
import { BackLinkComponent } from '../../../ui/back-link';
import { BadgeStatus, StatusBadgeComponent } from '../../../ui/status-badge';
import { AvatarComponent } from '../../../ui/avatar';
import { SymptomFormViewComponent } from '../../../ui/symptom-form-view';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-patient-appointment-detail',
  imports: [
    RouterModule,
    FormsModule,
    FullNamePipe,
    AiBriefComponent,
    BackLinkComponent,
    StatusBadgeComponent,
    AvatarComponent,
    SymptomFormViewComponent,

    DatePipe,
  ],
  templateUrl: './patient-appointment-detail.html',
})
export class PatientAppointmentDetailComponent {
  private route = inject(ActivatedRoute);
  private appointmentsService = inject(AppointmentsService);
  private reviewsService = inject(ReviewsService);

  showCancelModal = signal(false);

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

  reviewRating = signal(5);
  reviewComment = signal('');
  isSubmittingReview = signal(false);
  reviewSubmitted = signal(false);
  reviewError = signal<string | null>(null);

  symptomsText = '';
  durationDays: number | null = null;
  severity = 5;
  medications = '';
  knownConditions = '';

  isSubmittingForm = signal(false);
  formSubmitted = signal(false);
  aiBrief = signal<string | null>(null);
  isCancelling = signal(false);

  isPast = computed(() => {
    const apt = this.appointment();
    return apt?.status === 'COMPLETED' || apt?.status === 'CANCELLED';
  });

  isCompleted = computed(() => this.appointment()?.status === 'COMPLETED');

  submitSymptomForm() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.isSubmittingForm.set(true);

    this.appointmentsService
      .submitSymptomForm(id, {
        symptomsText: this.symptomsText,
        durationDays: this.durationDays,
        severity: this.severity,
        medications: this.medications || null,
        knownConditions: this.knownConditions || null,
      })
      .subscribe({
        next: () => {
          this.isSubmittingForm.set(false);
          this.formSubmitted.set(true);
          this.pollAiBrief(id);
        },
        error: () => this.isSubmittingForm.set(false),
      });
  }

  private pollAiBrief(appointmentId: string) {
    const interval = setInterval(() => {
      this.appointmentsService.getSymptomForm(appointmentId).subscribe((form) => {
        if (form.aiBrief) {
          this.aiBrief.set(form.aiBrief);
          clearInterval(interval);
        }
      });
    }, 3000);
  }

  cancelAppointment() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.isCancelling.set(true);
    this.appointmentsService.cancel(id).subscribe({
      next: () => {
        this.showCancelModal.set(false);
        window.location.reload();
      },
      error: () => this.isCancelling.set(false),
    });
  }

  submitReview() {
    const apt = this.appointment();
    if (!apt) return;
    this.isSubmittingReview.set(true);
    this.reviewError.set(null);

    this.reviewsService
      .submitReview(apt.doctorId, {
        appointmentId: apt.id,
        rating: this.reviewRating(),
        comment: this.reviewComment() || null,
      })
      .subscribe({
        next: () => {
          this.isSubmittingReview.set(false);
          this.reviewSubmitted.set(true);
        },
        error: (err) => {
          this.isSubmittingReview.set(false);
          this.reviewError.set(err.error?.message ?? 'Failed to submit review.');
        },
      });
  }
  badgeStatus(): BadgeStatus {
    return this.appointment()!.status.toLowerCase() as BadgeStatus;
  }
  setRating(rating: number) {
    this.reviewRating.set(rating);
  }
}
