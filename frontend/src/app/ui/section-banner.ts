import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface CtaLink {
  label: string;
  route: string;
  primary: boolean;
}

@Component({
  selector: 'app-cta-section',
  imports: [RouterLink],
  template: `
    <section class="w-full bg-[#0F1F38] py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-4xl font-medium text-white mb-4">{{ title() }}</h2>
        <p class="text-lg text-white/70 max-w-2xl mx-auto mb-8">{{ description() }}</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          @for (link of links(); track link.route) {
            <a
              [routerLink]="link.route"
              [class]="
                link.primary
                  ? 'inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-[#1B3A6B] bg-white rounded-md hover:bg-[#F8FAFC] transition-colors'
                  : 'inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors'
              "
            >
              {{ link.label }}
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class SectionBannerComponent {
  title = input.required<string>();
  description = input.required<string>();
  links = input.required<CtaLink[]>();
}
