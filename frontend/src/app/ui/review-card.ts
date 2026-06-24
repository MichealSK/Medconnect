import { Component, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AvatarComponent } from './avatar';
import { ReviewResponse } from '../services/reviews';

@Component({
  selector: 'app-review-card',
  imports: [DatePipe, AvatarComponent, TitleCasePipe],
  host: { class: 'block' },
  template: `
    <div class="p-4 bg-[#F8FAFC] rounded-lg">
      <div class="flex items-start justify-between gap-3 mb-2">
        <div class="flex items-center gap-2">
          <app-avatar [name]="review().patientName" size="sm" color="light-blue" />
          <p class="text-sm font-medium text-[#0F1F38]">{{ review().patientName | titlecase }}</p>
        </div>
        <div class="flex items-center gap-0.5 shrink-0">
          @for (star of [1, 2, 3, 4, 5]; track star) {
            <svg
              class="w-3.5 h-3.5"
              [class]="star <= review().rating ? 'text-[#F59E0B]' : 'text-[#E2E8F0]'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          }
        </div>
      </div>
      @if (review().comment) {
        <p class="text-sm text-[#64748B] leading-relaxed">{{ review().comment }}</p>
      }
      <p class="text-xs text-[#94A3B8] mt-2">{{ review().createdAt | date: 'MMM d, y' }}</p>
    </div>
  `,
})
export class ReviewCardComponent {
  review = input.required<ReviewResponse>();
}
