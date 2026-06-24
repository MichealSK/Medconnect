import { Component, input, computed } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowPath } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-ai-brief',
  imports: [MarkdownComponent, NgIconComponent],
  providers: [provideIcons({ heroArrowPath })],
  host: { class: 'block' },
  template: `
    <div class="p-6 bg-white border border-[#E2E8F0] rounded-[10px] shadow-sm">
      <h2 class="text-base font-medium text-[#0F1F38] mb-4">AI consultation brief</h2>
      @if (brief()) {
        <markdown
          class="text-sm text-[#64748B] leading-relaxed prose prose-sm max-w-none
         prose-headings:text-[#0F1F38] prose-headings:font-medium
         prose-strong:text-[#0F1F38] prose-strong:font-medium
         prose-ul:mt-2 prose-li:my-0.5
         prose-p:mb-4"
          [data]="formattedBrief()"
        />
      } @else {
        <div class="flex items-center gap-2 text-sm text-[#64748B]">
          <ng-icon name="heroArrowPath" size="16" class="animate-spin" />
          Generating AI brief...
        </div>
      }
    </div>
  `,
})
export class AiBriefComponent {
  brief = input<string | null | undefined>();

  formattedBrief = computed(() => {
    const text = this.brief();
    if (!text) return null;
    return text
      .replace(/(Summary of|Urgency level|Suggested questions|Relevant background)/gi, '\n\n**$1**')
      .trim();
  });
}
