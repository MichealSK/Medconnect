import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { DoctorRegisterRequest, PatientRegisterRequest } from '../../models/register-request';
import { Role } from '../../models/user';
import { NgClass } from '@angular/common';

const SPECIALTIES = [
  'General Practice',
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Psychiatry',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
];

const LANGUAGES = [
  'English',
  'French',
  'German',
  'Spanish',
  'Arabic',
  'Hindi',
  'Mandarin',
  'Portuguese',
];

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './register.html',
})
export class Register {
  private readonly authService = inject(AuthService);
  readonly specialties = SPECIALTIES;
  readonly languages = LANGUAGES;

  role = signal<'patient' | 'doctor'>('patient');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  firstName = '';
  lastName = '';
  email = '';
  password = '';

  specialty = '';
  selectedLanguages = signal<string[]>([]);
  yearsExperience: number | null = null;
  bio = '';

  get bioWordCount(): number {
    if (!this.bio.trim()) return 0;
    return this.bio.trim().split(/\s+/).length;
  }

  isDoctorFormValid(): boolean {
    if (this.role() === 'patient') return true;

    return (
      this.selectedLanguages().length > 0 &&
      this.yearsExperience !== null &&
      this.yearsExperience >= 0 &&
      this.bioWordCount >= 300
    );
  }

  setRole(role: 'patient' | 'doctor') {
    this.role.set(role);
    this.errorMessage.set(null);
  }

  toggleLanguage(lang: string) {
    const current = this.selectedLanguages();
    if (current.includes(lang)) {
      this.selectedLanguages.set(current.filter((l) => l !== lang));
    } else {
      this.selectedLanguages.set([...current, lang]);
    }
  }

  isLanguageSelected(lang: string): boolean {
    return this.selectedLanguages().includes(lang);
  }

  onSubmit() {
    if (!this.isDoctorFormValid()) {
      this.errorMessage.set(
        'Please ensure all doctor requirements are met (Bio word count, languages, and experience).',
      );
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    if (this.role() === 'patient') {
      const payload: PatientRegisterRequest = {
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        role: Role.PATIENT,
      };

      this.authService.registerPatient(payload).subscribe({
        complete: () => {
          this.isLoading.set(false);
          this.successMessage.set('Success! Please check your email to verify your account.');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Registration failed. Please try again.');
        },
      });
    } else {
      const payload: DoctorRegisterRequest = {
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        specialty: this.specialty,
        languages: this.selectedLanguages(),
        yearsExperience: this.yearsExperience!,
        bio: this.bio,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      this.authService.registerDoctor(payload).subscribe({
        complete: () => {
          this.isLoading.set(false);
          this.successMessage.set('Success! Please check your email to verify your account.');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Registration failed. Please try again.');
        },
      });
    }
  }
}
