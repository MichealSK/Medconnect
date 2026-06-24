import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { DoctorsService } from '../../services/doctors';
import { StatsService } from '../../services/stats';
import { InitialsPipe } from '../../shared/pipes/initials-pipe';
import { FullNamePipe } from '../../shared/pipes/doctor-full-name-pipe';
import { DecimalPipe } from '@angular/common';

const SPECIALTIES = [
  'All',
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Psychiatry',
  'Orthopedics',
  'General Practice',
  'Pediatrics',
  'Gynecology',
];

@Component({
  selector: 'app-hero',
  imports: [RouterLink, AsyncPipe, InitialsPipe, FullNamePipe, DecimalPipe],
  templateUrl: './hero.html',
})
export class Hero {
  private readonly doctorsService = inject(DoctorsService);
  private readonly statsService = inject(StatsService);

  readonly specialties = SPECIALTIES;
  activeFilter = signal('All');
  searchQuery = signal('');
  patientCount = signal<number | null>(null);

  constructor() {
    this.statsService.getPlatformStats().subscribe((stats) => {
      this.patientCount.set(stats.patientCount);
    });
  }

  readonly doctors$ = combineLatest([
    this.doctorsService.getAll(),
    toObservable(this.activeFilter),
    toObservable(this.searchQuery),
  ]).pipe(
    map(([doctors, filter, query]) => {
      let result = doctors;
      if (filter !== 'All') {
        result = result.filter((d) => d.specialty === filter);
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(
          (d) =>
            d.firstName.toLowerCase().includes(q) ||
            d.lastName.toLowerCase().includes(q) ||
            d.specialty.toLowerCase().includes(q),
        );
      }
      return result.slice(0, 3);
    }),
  );

  setFilter(specialty: string) {
    this.activeFilter.set(specialty);
  }

}
