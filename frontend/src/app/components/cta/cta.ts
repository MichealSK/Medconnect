import { Component, inject } from '@angular/core';
import { AuthStateService } from '../../auth/services/auth-state';
import { CtaLink, SectionBannerComponent } from '../../ui/section-banner';

@Component({
  selector: 'app-cta',
  imports: [SectionBannerComponent],
  templateUrl: './cta.html',
})
export class Cta {
  readonly authState = inject(AuthStateService);

  readonly title = 'Join the conversation';
  readonly description =
    'Connect with doctors and patients in our community forum. Share experiences, ask questions, and get insights from healthcare professionals worldwide.';

  get links(): CtaLink[] {
    return [
      {
        label: this.authState.isLoggedIn ? 'Go to forum' : 'Register',
        route: this.authState.isLoggedIn ? '/forum' : '/auth/register',
        primary: true,
      },
    ];
  }
}
