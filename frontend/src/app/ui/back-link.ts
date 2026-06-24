import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChevronLeft } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-back-link',
  imports: [RouterLink, NgIconComponent],
  providers: [provideIcons({ heroChevronLeft })],
  template: `
    <a
      [routerLink]="route()"
      class="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#1B3A6B] mb-6"
    >
      <ng-icon name="heroChevronLeft" size="16" />
      {{ label() }}
    </a>
  `,
})
export class BackLinkComponent {
  route = input.required<string>();
  label = input<string>('Back');
}
