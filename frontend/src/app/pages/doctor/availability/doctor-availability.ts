import { Component, inject, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DoctorsService } from '../../../services/doctors';
import { AvailabilitySlot } from '../../../models/doctor';
import { BackLinkComponent } from '../../../ui/back-link';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_OPTIONS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
];

@Component({
  selector: 'app-doctor-availability',
  imports: [RouterModule, FormsModule, BackLinkComponent],
  templateUrl: './doctor-availability.html',
})
export class DoctorAvailabilityComponent {
  private doctorsService = inject(DoctorsService);

  selectedDay = signal(0);
  newSlotTime = signal('09:00');
  isAdding = signal(false);
  deletingId = signal<string | null>(null);
  refresh = signal(0);
  newSlotDuration = signal(30);

  dayNames = DAY_NAMES;
  timeOptions = TIME_OPTIONS;

  profile = toSignal(this.doctorsService.getMyProfile());

  slots = toSignal(
    toObservable(this.refresh).pipe(
      switchMap(() => this.doctorsService.getMyProfile()),
      switchMap((p) => this.doctorsService.getSlots(p.id)),
    ),
    { initialValue: [] as AvailabilitySlot[] },
  );

  weekDates = computed(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
  });

  slotsForSelectedDay = computed(() =>
    this.slots().filter((s) => s.isActive && s.dayOfWeek === this.selectedDay()),
  );

  addSlot() {
    const profile = this.profile();
    if (!profile) return;
    const startTime = this.newSlotTime();
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date(0, 0, 0, hours, minutes + this.newSlotDuration());
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    this.isAdding.set(true);
    this.doctorsService
      .addSlot(profile.id, {
        dayOfWeek: this.selectedDay(),
        startTime,
        endTime,
      })
      .subscribe({
        next: () => {
          this.isAdding.set(false);
          this.refresh.update((r) => r + 1);
        },
        error: () => this.isAdding.set(false),
      });
  }

  deleteSlot(slotId: string) {
    const profile = this.profile();
    if (!profile) return;
    this.deletingId.set(slotId);
    this.doctorsService.deleteSlot(profile.id, slotId).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.refresh.update((r) => r + 1);
      },
      error: () => this.deletingId.set(null),
    });
  }
}
