import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../auth/services/auth-state';
import { AuthService } from '../../auth/services/auth-service';
import { DoctorsService } from '../../services/doctors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Role } from '../../auth/models/user';
import { NEVER } from 'rxjs';
import { Doctor } from '../../models/doctor';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  imports: [FormsModule, TitleCasePipe, UpperCasePipe],
  templateUrl: './profile-card.html',
})
export class ProfileCardComponent {
  private authState = inject(AuthStateService);
  private authService = inject(AuthService);
  private doctorsService = inject(DoctorsService);

  user = this.authState.currentUser;
  isDoctor = this.user?.role === Role.DOCTOR;

  editModalOpen = signal(false);
  activeTab = signal<'personal' | 'password' | 'professional'>('personal');

  firstName = signal(this.user?.firstName ?? '');
  lastName = signal(this.user?.lastName ?? '');

  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  profile = toSignal<Doctor | null>(this.isDoctor ? this.doctorsService.getMyProfile() : NEVER, {
    initialValue: null,
  });

  specialty = signal('');
  bio = signal<string>('');
  yearsExperience = signal<number>(0);
  languages = signal<string[]>([]);

  isSavingPersonal = signal(false);
  isSavingPassword = signal(false);
  isSavingProfessional = signal(false);

  personalMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  passwordMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  professionalMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  successMessage = signal<string | null>(null);

  readonly SPECIALTIES = [
    'General Practice',
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Psychiatry',
    'Orthopedics',
    'Pediatrics',
  ];

  readonly LANGUAGES = ['English', 'French', 'German', 'Spanish', 'Arabic', 'Hindi'];

  openModal() {
    if (this.isDoctor && this.profile()) {
      this.specialty.set(this.profile()!.specialty ?? '');
      this.bio.set(this.profile()!.bio ?? '');
      this.languages.set([...this.profile()!.languages]);
      this.yearsExperience.set(this.profile()!.yearsExperience ?? 0);
    }
    this.editModalOpen.set(true);
  }

  savePersonal() {
    this.isSavingPersonal.set(true);
    this.authService
      .updateProfile({
        firstName: this.firstName(),
        lastName: this.lastName(),
      })
      .subscribe({
        next: (updated) => {
          this.authState.setSession(this.authState.accessToken!, {
            ...this.user!,
            firstName: updated.firstName,
            lastName: updated.lastName,
          });
          this.isSavingPersonal.set(false);
          this.showSuccess('Personal info updated successfully.');
        },
        error: () => {
          this.isSavingPersonal.set(false);
          this.personalMessage.set({ type: 'error', text: 'Failed to update personal info.' });
        },
      });
  }

  savePassword() {
    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordMessage.set({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (this.newPassword().length < 8) {
      this.passwordMessage.set({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    this.isSavingPassword.set(true);
    this.authService
      .changePassword({
        currentPassword: this.currentPassword(),
        newPassword: this.newPassword(),
      })
      .subscribe({
        next: () => {
          this.isSavingPassword.set(false);
          this.currentPassword.set('');
          this.newPassword.set('');
          this.confirmPassword.set('');
          this.showSuccess('Password changed successfully.');
        },
        error: (err) => {
          this.isSavingPassword.set(false);
          this.passwordMessage.set({
            type: 'error',
            text: err.error?.message ?? 'Failed to change password.',
          });
        },
      });
  }

  saveProfessional() {
    if (!this.profile()) return;
    this.isSavingProfessional.set(true);
    this.doctorsService
      .updateProfile(this.profile()!.id, {
        specialty: this.specialty(),
        bio: this.bio(),
        languages: this.languages(),
        yearsExperience: this.yearsExperience(),
        timezone: this.profile()!.timezone ?? 'UTC',
        profilePhotoUrl: this.profile()!.profilePhotoUrl ?? null,
      })
      .subscribe({
        next: () => {
          this.isSavingProfessional.set(false);
          this.showSuccess('Professional info updated successfully.');
        },
        error: () => {
          this.isSavingProfessional.set(false);
          this.professionalMessage.set({
            type: 'error',
            text: 'Failed to update professional info.',
          });
        },
      });
  }

  toggleLanguage(lang: string) {
    this.languages.update((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  }
  private showSuccess(message: string) {
    this.successMessage.set(message);
  }
  setTab(tab: 'personal' | 'password' | 'professional') {
    this.activeTab.set(tab);
    this.successMessage.set(null);
    this.personalMessage.set(null);
    this.passwordMessage.set(null);
    this.professionalMessage.set(null);
  }
}
