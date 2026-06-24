import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass,
  heroCalendarDays,
  heroVideoCamera,
} from '@ng-icons/heroicons/outline';

export type IconName = 'heroMagnifyingGlass' | 'heroCalendarDays' | 'heroVideoCamera';

@Component({
  selector: 'app-step-card',
  imports: [NgIconComponent],
  providers: [provideIcons({ heroMagnifyingGlass, heroCalendarDays, heroVideoCamera })],
  template: `
    <div class="p-6 bg-white border border-[#E2E8F0] rounded-[10px]">
      <div class="flex items-center gap-4 mb-4">
        <div
          class="flex items-center justify-center w-12 h-12 bg-[#EEF2FF] rounded-lg text-[#1B3A6B]"
        >
          <ng-icon [name]="icon()" size="24" />
        </div>
        <span class="text-xs font-medium text-[#64748B] uppercase tracking-wider"
          >Step {{ step() }}</span
        >
      </div>
      <h3 class="text-lg font-medium text-[#0F1F38] mb-2">{{ title() }}</h3>
      <p class="text-sm text-[#64748B] leading-relaxed">{{ description() }}</p>
    </div>
  `,
})
export class StepCardComponent {
  step = input.required<string>();
  icon = input.required<IconName>();
  title = input.required<string>();
  description = input.required<string>();
}
