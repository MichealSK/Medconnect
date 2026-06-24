import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, FormsModule],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);

  email = '';
  isLoading = signal(false);
  isSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.forgotPassword(this.email).subscribe({
      complete: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
    });
  }
}
