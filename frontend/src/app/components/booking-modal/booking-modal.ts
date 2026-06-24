import { Component, input, output, inject, signal, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DoctorsService } from '../../services/doctors';
import { Doctor } from '../../models/doctor';
import { AppointmentsService } from '../../services/appointments';
import { FullNamePipe } from '../../shared/pipes/doctor-full-name-pipe';
import { DatePipe } from '@angular/common';

interface SelectedSlot {
  date: Date;
  startTime: string;
  slotId: string;
  isBooked: boolean;
}

@Component({
  selector: 'app-booking-modal',
  imports: [FormsModule, FullNamePipe, DatePipe],
  templateUrl: './booking-modal.html',
})
export class BookingModalComponent {
  doctor = input.required<Doctor>();
  close = output<void>();

  private doctorsService = inject(DoctorsService);
  private appointmentsService = inject(AppointmentsService);

  step = signal(1);
  dayOffset = signal(0);
  selectedSlot = signal<SelectedSlot | null>(null);
  isSubmitting = signal(false);
  appointment = signal<any>(null);
  aiBrief = signal<string | null>(null);

  form = {
    symptomsText: '',
    durationDays: null as number | null,
    severity: 5,
    medications: '',
    knownConditions: '',
  };

  steps = [
    { n: 1, label: 'Select slot' },
    { n: 2, label: 'Symptoms' },
    { n: 3, label: 'Confirmed' },
  ];

  slots = toSignal(
    toObservable(this.doctor).pipe(switchMap((d) => this.doctorsService.getSlots(d.id))),
  );

  bookedSlots = toSignal(
    toObservable(this.doctor).pipe(switchMap((d) => this.doctorsService.getBookedSlots(d.id))),
    { initialValue: [] },
  );

  currentDay = computed(() => {
    const d = new Date();
    d.setDate(d.getDate() + this.dayOffset());
    const jsDay = d.getDay();
    const javaDay = jsDay === 0 ? 6 : jsDay - 1;
    return {
      date: d,
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'long' }),
      dateLabel: d.getDate(),
      monthLabel: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      slots: (this.slots() ?? [])
        .filter((s) => s.isActive && s.dayOfWeek === javaDay)
        .map((s) => {
          const [hours, minutes] = s.startTime.split(':').map(Number);
          const slotDate = new Date(d);
          slotDate.setHours(hours, minutes, 0, 0);
          const isPast = slotDate <= new Date();
          const isBooked = this.bookedSlots().some(
            (b) => new Date(b).getTime() === slotDate.getTime(),
          );
          return { slotId: s.id, startTime: s.startTime, date: d, isBooked: isBooked || isPast };
        }),
    };
  });

  prevDay() {
    this.dayOffset.update((d) => Math.max(0, d - 1));
  }
  nextDay() {
    this.dayOffset.update((d) => d + 1);
  }

  confirmBooking() {
    const slot = this.selectedSlot();
    if (!slot) return;

    this.isSubmitting.set(true);

    const [hours, minutes] = slot.startTime.split(':').map(Number);
    const scheduledAt = new Date(slot.date);
    scheduledAt.setHours(hours, minutes, 0, 0);

    this.appointmentsService
      .book({
        doctorId: this.doctor().id,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: 30,
      })
      .subscribe({
        next: (appt) => {
          this.appointment.set(appt);
          this.submitSymptomForm(appt.id);
        },
        error: () => this.isSubmitting.set(false),
      });
  }

  private submitSymptomForm(appointmentId: string) {
    this.appointmentsService
      .submitSymptomForm(appointmentId, {
        symptomsText: this.form.symptomsText,
        durationDays: this.form.durationDays,
        severity: this.form.severity,
        medications: this.form.medications || null,
        knownConditions: this.form.knownConditions || null,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.step.set(3);
          this.pollAiBrief(appointmentId);
        },
        error: () => {
          this.isSubmitting.set(false);
          this.step.set(3);
        },
      });
  }

  private pollAiBrief(appointmentId: string) {
    const interval = setInterval(() => {
      this.appointmentsService.getSymptomForm(appointmentId).subscribe((form) => {
        if (form.aiBrief) {
          this.aiBrief.set(
            form.aiBrief.replace(
              /\*\*(.*?)\*\*/g,
              '<span class="font-bold text-[#0F0F0F]">$1</span>',
            ),
          );
          clearInterval(interval);
        }
      });
    }, 3000);
  }
}
