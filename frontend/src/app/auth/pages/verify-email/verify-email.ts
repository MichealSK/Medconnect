import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
})
export class VerifyEmail implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  isLoading = signal(true);
  isSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.isLoading.set(false);
      this.errorMessage.set('Invalid verification link.');
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Verification failed. Please try again.');
      },
    });
  }
}
