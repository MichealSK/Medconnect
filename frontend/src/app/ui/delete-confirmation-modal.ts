import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        class="bg-white rounded-xl p-6 w-full max-w-sm mx-4"
        style="box-shadow: 0 4px 24px rgba(0,0,0,0.10)"
      >
        <h3 class="text-base font-semibold text-[#0F1F38] mb-1">Delete {{ type() }}</h3>
        <p class="text-sm text-[#64748B] mb-6">
          Are you sure you want to delete your {{ type() }}?
        </p>
        <div class="flex items-center justify-end gap-3">
          <button
            (click)="cancelled.emit()"
            class="px-4 py-2 text-sm text-[#64748B] hover:text-[#0F1F38] transition-colors"
          >
            Cancel
          </button>
          <button
            (click)="confirmed.emit()"
            class="px-4 py-2 text-sm font-medium text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  type = input.required<'post' | 'comment' | 'reply'>();
  confirmed = output();
  cancelled = output();
}
