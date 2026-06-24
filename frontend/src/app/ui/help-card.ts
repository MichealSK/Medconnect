import { Component } from '@angular/core';
@Component({
  selector: 'app-help-card',
  template: `
    <div class="bg-[#1B3A6B] rounded-[10px] p-5 text-white">
      <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="text-base font-medium mb-2">Need Help?</h3>
      <p class="text-sm opacity-80 mb-4">Our support team is available 24/7 to assist you.</p>
      <a
        href="https://mail.google.com/mail/?view=cm&to=noreply.medconnect5@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full px-4 py-2 text-center text-sm font-medium text-[#1B3A6B] bg-white rounded-md hover:bg-[#F8FAFC] transition-colors"
      >
        Contact Support
      </a>
    </div>
  `,
})
export class HelpCardComponent {}
