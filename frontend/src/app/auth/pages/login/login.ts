import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/user';
import { AuthService } from '../../services/auth-service';
import { AuthStateService } from '../../services/auth-state';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);
  sessionExpired = toSignal(
    this.route.queryParams.pipe(map((p) => p['sessionExpired'] === 'true')),
    { initialValue: false },
  );

  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const role = this.authState.currentUser?.role;
        if (role === Role.DOCTOR) {
          this.router.navigate(['/doctor/dashboard']).then(()=>{});
        } else {
          this.router.navigate(['/patient/dashboard']).then(()=>{});
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Login failed. Please try again.');
      },
    });
  }
}
