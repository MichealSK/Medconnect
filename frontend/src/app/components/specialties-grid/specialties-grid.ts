import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideStethoscope,
  lucideHeart,
  lucideBrain,
  lucideFingerprint,
  lucideMessageCircleHeart,
  lucideBone,
  lucideBaby,
  lucideVenus,
} from '@ng-icons/lucide';
import { DoctorsService } from '../../services/doctors';
import { map } from 'rxjs';

@Component({
  selector: 'app-specialties-grid',
  imports: [RouterLink, AsyncPipe, NgIconComponent],
  providers: [
    provideIcons({
      lucideStethoscope,
      lucideHeart,
      lucideBrain,
      lucideFingerprint,
      lucideMessageCircleHeart,
      lucideBone,
      lucideBaby,
      lucideVenus,
    }),
  ],
  templateUrl: './specialties-grid.html',
})
export class SpecialtiesGrid {
  private readonly doctorsService = inject(DoctorsService);

  readonly specialties = this.doctorsService.getAll().pipe(
    map((doctors) => [
      {
        name: 'General Practice',
        icon: 'lucideStethoscope',
        count: doctors.filter((d) => d.specialty === 'General Practice').length,
      },
      {
        name: 'Cardiology',
        icon: 'lucideHeart',
        count: doctors.filter((d) => d.specialty === 'Cardiology').length,
      },
      {
        name: 'Neurology',
        icon: 'lucideBrain',
        count: doctors.filter((d) => d.specialty === 'Neurology').length,
      },
      {
        name: 'Dermatology',
        icon: 'lucideFingerprint',
        count: doctors.filter((d) => d.specialty === 'Dermatology').length,
      },
      {
        name: 'Psychiatry',
        icon: 'lucideMessageCircleHeart',
        count: doctors.filter((d) => d.specialty === 'Psychiatry').length,
      },
      {
        name: 'Orthopedics',
        icon: 'lucideBone',
        count: doctors.filter((d) => d.specialty === 'Orthopedics').length,
      },
      {
        name: 'Pediatrics',
        icon: 'lucideBaby',
        count: doctors.filter((d) => d.specialty === 'Pediatrics').length,
      },
      {
        name: 'Gynecology',
        icon: 'lucideVenus',
        count: doctors.filter((d) => d.specialty === 'Gynecology').length,
      },
    ]),
  );
}
