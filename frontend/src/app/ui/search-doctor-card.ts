import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AvatarComponent } from './avatar';
import { FullNamePipe } from '../shared/pipes/doctor-full-name-pipe';
import { Doctor } from '../models/doctor';

@Component({
  selector: 'app-search-doctor-card',
  imports: [RouterLink, DecimalPipe, AvatarComponent, FullNamePipe],
  template: `
    <a
      [routerLink]="['/doctors', doctor().id]"
      class="block p-4 bg-white border border-[#E2E8F0] rounded-[10px] hover:border-[#1B3A6B] hover:shadow-sm transition-all group"
    >
      <div class="flex items-center gap-3">
        <app-avatar [name]="doctor().firstName + ' ' + doctor().lastName" size="sm" />
        <div class="min-w-0">
          <p
            class="text-sm font-medium text-[#0F1F38] group-hover:text-[#1B3A6B] truncate transition-colors"
          >
            {{ doctor() | fullName }}
          </p>
          <p class="text-xs text-[#64748B]">{{ doctor().specialty }}</p>
        </div>
      </div>
      @if (doctor().bio) {
        <p class="mt-2.5 text-xs text-[#64748B] line-clamp-2">{{ doctor().bio }}</p>
      }
      <div class="mt-2 flex items-center justify-between">
        <p class="text-xs text-[#94A3B8] truncate">{{ doctor().languages.join(', ') }}</p>
        @if (doctor().averageRating) {
          <p class="text-xs text-[#64748B] shrink-0">
            ⭐ {{ doctor().averageRating | number: '1.1-1' }}
          </p>
        } @else {
          <p class="text-xs text-[#94A3B8] shrink-0">No reviews</p>
        }
      </div>
    </a>
  `,
})
export class SearchDoctorCardComponent {
  doctor = input.required<Doctor>();
}
