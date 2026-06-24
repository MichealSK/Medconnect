import {
  Component,
  inject,
  OnDestroy,
  ElementRef,
  ViewChild,
  afterNextRender,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStateService } from '../../auth/services/auth-state';

declare const JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-meeting',
  imports: [],
  templateUrl: './meeting.html',
})
export class MeetingComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authState = inject(AuthStateService);

  @ViewChild('jitsiContainer', { static: true }) jitsiContainer!: ElementRef;

  private api: any = null;
  roomName = this.route.snapshot.paramMap.get('roomName')!;

  private _ = afterNextRender(() => this.initJitsi());

  private initJitsi() {
    const user = this.authState.currentUser;
    this.api = new JitsiMeetExternalAPI('meet.jit.si', {
      roomName: this.roomName,
      parentNode: this.jitsiContainer.nativeElement,
      width: '100%',
      height: '100%',
      userInfo: {
        displayName: user ? `${user.firstName} ${user.lastName}` : 'Guest',
        email: user?.email ?? '',
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
    });

    this.api.addEventListener('readyToClose', () => this.leaveCall());
  }

  leaveCall() {
    this.api?.dispose();
    this.router.navigate(['/patient/dashboard']).then(()=>{});
  }

  ngOnDestroy() {
    this.api?.dispose();
  }
}
