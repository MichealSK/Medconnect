import { Component, input } from '@angular/core';
import { SymptomFormResponse } from '../services/appointments';

@Component({
  selector: 'app-symptom-form-view',
  host: { class: 'block' },
  template: `
    <div class="p-6 bg-white border border-[#E2E8F0] rounded-[10px] shadow-sm">
      <h2 class="text-base font-medium text-[#0F1F38] mb-4">{{ title() }}</h2>
      <div class="space-y-3 text-sm">
        <div class="p-3 bg-[#F8FAFC] rounded-lg">
          <p class="text-xs text-[#64748B] mb-1">Main symptoms</p>
          <p class="text-[#0F1F38]">{{ form().symptomsText }}</p>
        </div>
        @if (form().durationDays) {
          <div class="p-3 bg-[#F8FAFC] rounded-lg">
            <p class="text-xs text-[#64748B] mb-1">Duration</p>
            <p class="text-[#0F1F38]">{{ form().durationDays }} days</p>
          </div>
        }
        @if (form().severity) {
          <div class="p-3 bg-[#F8FAFC] rounded-lg">
            <p class="text-xs text-[#64748B] mb-1">Severity</p>
            <p class="text-[#0F1F38]">{{ form().severity }}/10</p>
          </div>
        }
        @if (form().medications) {
          <div class="p-3 bg-[#F8FAFC] rounded-lg">
            <p class="text-xs text-[#64748B] mb-1">Medications</p>
            <p class="text-[#0F1F38]">{{ form().medications }}</p>
          </div>
        }
        @if (form().knownConditions) {
          <div class="p-3 bg-[#F8FAFC] rounded-lg">
            <p class="text-xs text-[#64748B] mb-1">Known conditions</p>
            <p class="text-[#0F1F38]">{{ form().knownConditions }}</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class SymptomFormViewComponent {
  form = input.required<SymptomFormResponse>();
  title = input<string>('Symptom form');
}
