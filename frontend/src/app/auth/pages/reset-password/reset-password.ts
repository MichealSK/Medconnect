import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, FormsModule],
  templateUrl: './reset-password.html',
})
export class ResetPassword implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  token = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = signal(false);
  isSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.errorMessage.set('Invalid reset link.');
      return;
    }
    this.token = token;
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      complete: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Reset failed. Please try again.');
      },
    });
  }
}
