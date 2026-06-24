import { Component, inject, signal } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs';
import { DoctorsService } from '../../../services/doctors';
import { BookingModalComponent } from '../../../components/booking-modal/booking-modal';
import { AuthService } from '../../../auth/services/auth-service';
import { ReviewsService } from '../../../services/reviews';
import { FullNamePipe } from '../../../shared/pipes/doctor-full-name-pipe';
import { ReviewCardComponent } from '../../../ui/review-card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { AvatarComponent } from '../../../ui/avatar';
import { heroCheckBadge, heroChevronLeft } from '@ng-icons/heroicons/outline';
import { lucideStar } from '@ng-icons/lucide';
import { BackLinkComponent } from '../../../ui/back-link';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-doctor-detail',
  providers: [provideIcons({ heroChevronLeft, heroCheckBadge, lucideStar })],
  imports: [
    RouterModule,
    BookingModalComponent,
    FullNamePipe,
    ReviewCardComponent,
    NgIcon,
    AvatarComponent,
    BackLinkComponent,
    DecimalPipe,
  ],
  templateUrl: './doctor-details.html',
})
export class DoctorDetailComponent {
  private route = inject(ActivatedRoute);
  private doctorsService = inject(DoctorsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private reviewsService = inject(ReviewsService);

  modalOpen = signal(false);

  doctor = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('id')!),
      switchMap((id) => this.doctorsService.getById(id)),
    ),
  );

  reviews = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('id')!),
      switchMap((id) => this.reviewsService.getReviews(id)),
    ),
    { initialValue: [] },
  );

  openBookingModal() {
    if (this.authService.requireAuth(this.router.url)) {
      this.modalOpen.set(true);
    }
  }
}
