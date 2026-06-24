import { Component, inject } from '@angular/core';
import { StatsService } from '../../services/stats';
import { PlatformStats } from '../../models/stats';

@Component({
  selector: 'app-stats-bar',
  templateUrl: './stats-bar.html',
})
export class StatsBar {
  private readonly statsService = inject(StatsService);
  private platformStats: PlatformStats | null = null;

  constructor() {
    this.statsService.getPlatformStats().subscribe((stats) => {
      this.platformStats = stats;
    });
  }

  get stats() {
    return [
      { value: this.platformStats?.doctorCount?.toString() ?? '...', label: 'Verified Doctors' },
      { value: this.platformStats?.patientCount?.toString() ?? '...', label: 'Patients' },
      {
        value: this.platformStats?.averageDoctorRating?.toFixed(1) ?? '...',
        label: 'Average Rating',
      },
      { value: '8', label: 'Specialties Available' },
    ];
  }
}
