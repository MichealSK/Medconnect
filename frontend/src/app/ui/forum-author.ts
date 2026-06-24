import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheckBadge } from '@ng-icons/heroicons/outline';
import { AvatarComponent } from './avatar';

@Component({
  selector: 'app-forum-author',
  imports: [NgIconComponent, AvatarComponent],
  providers: [provideIcons({ heroCheckBadge })],
  host: { class: 'block' },
  template: `
    <div class="flex items-center gap-3">
      <app-avatar
        [name]="name()"
        [size]="size()"
        [color]="role() === 'DOCTOR' ? 'light-blue' : 'green'"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm font-medium text-[#0F1F38]">{{ name() }}</span>
          @if (role() === 'DOCTOR') {
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-[#EEF2FF] text-[#1B3A6B] rounded-full"
            >
              <ng-icon name="heroCheckBadge" size="12" />
              Verified Doctor
            </span>
          } @else {
            <span
              class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-[#D1FAE5] text-[#065F46] rounded-full"
            >
              Patient
            </span>
          }
        </div>
        @if (date()) {
          <p class="text-xs text-[#64748B] mt-0.5">{{ date() }}</p>
        }
      </div>
    </div>
  `,
})
export class ForumAuthorComponent {
  name = input.required<string>();
  role = input.required<string>();
  date = input<string>();
  size = input<'sm' | 'md'>('md');
}
