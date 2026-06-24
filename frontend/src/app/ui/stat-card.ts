import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCalendarDays,
  heroCheckCircle,
  heroUserGroup,
  heroClock,
} from '@ng-icons/heroicons/outline';

export interface StatCard {
  label: string;
  value: number;
  sublabel?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

@Component({
  selector: 'app-stat-card',
  imports: [NgIconComponent],
  providers: [provideIcons({ heroCalendarDays, heroCheckCircle, heroUserGroup, heroClock })],
  template: `
    <div class="p-5 bg-white border border-[#E2E8F0] rounded-[10px] shadow-sm">
      <div class="flex items-center justify-between">
        <p class="text-sm text-[#64748B]">{{ label() }}</p>
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" [class]="iconBg()">
          <ng-icon [name]="icon()" size="16" [class]="iconColor()" />
        </div>
      </div>
      <p class="text-3xl font-medium text-[#0F1F38] mt-2">{{ value() }}</p>
      @if (sublabel()) {
        <p class="text-xs text-[#64748B] mt-1">{{ sublabel() }}</p>
      }
    </div>
  `,
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<number>();
  sublabel = input<string>();
  icon = input.required<string>();
  iconBg = input.required<string>();
  iconColor = input.required<string>();
}
