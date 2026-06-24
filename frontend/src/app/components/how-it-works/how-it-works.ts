import { Component } from '@angular/core';
import { heroMagnifyingGlass, heroCalendar, heroVideoCamera } from '@ng-icons/heroicons/outline';
import { provideIcons } from '@ng-icons/core';
import { StepCardComponent, IconName } from '../../ui/step-card';

@Component({
  selector: 'app-how-it-works',
  providers: [provideIcons({ heroMagnifyingGlass, heroCalendar, heroVideoCamera })],
  imports: [StepCardComponent],
  host: { id: 'how-it-works' },
  templateUrl: './how-it-works.html',
})
export class HowItWorks {
  readonly steps: { step: string; icon: IconName; title: string; description: string }[] = [
    {
      step: '01',
      icon: 'heroMagnifyingGlass',
      title: 'Find your specialist',
      description:
        'Browse through our network of verified doctors. Filter by specialty, language, and availability to find the perfect match.',
    },
    {
      step: '02',
      icon: 'heroCalendarDays',
      title: 'Book an appointment',
      description:
        "Choose a convenient time slot from the doctor's availability. Instant confirmation with email reminders sent to both you and your doctor.",
    },
    {
      step: '03',
      icon: 'heroVideoCamera',
      title: 'Join your consultation',
      description:
        'Connect via secure video call at your scheduled time. Get personalized care, an AI-prepared symptom brief, and post-appointment notes.',
    },
  ];
}
