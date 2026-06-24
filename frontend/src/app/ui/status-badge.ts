import { Component, input, computed } from '@angular/core';

export type BadgeStatus = 'available' | 'unavailable' | 'confirmed' | 'cancelled' | 'completed';

@Component({
  selector: 'app-status-badge',
  template: `
    <span [class]="badgeClass()">
      <span [class]="dotClass()"></span>
      {{ label() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  status = input.required<BadgeStatus>();

  label = computed(
    () =>
      ({
        available: 'Available today',
        unavailable: 'Unavailable',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed',
      })[this.status()],
  );

  badgeClass = computed(() => {
    const variants: Record<BadgeStatus, string> = {
      available: 'bg-[#DCFCE7] text-[#166534]',
      unavailable: 'bg-[#F1F5F9] text-[#64748B]',
      confirmed: 'bg-[#EEF2FF] text-[#1B3A6B]',
      cancelled: 'bg-[#FEE2E2] text-[#991B1B]',
      completed: 'bg-[#F0FDF4] text-[#166534]',
    };
    return `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variants[this.status()]}`;
  });

  dotClass = computed(() => {
    const dots: Record<BadgeStatus, string> = {
      available: 'bg-[#16A34A]',
      unavailable: 'bg-[#94A3B8]',
      confirmed: 'bg-[#1B3A6B]',
      cancelled: 'bg-[#EF4444]',
      completed: 'bg-[#16A34A]',
    };
    return `w-1.5 h-1.5 rounded-full ${dots[this.status()]}`;
  });
}
