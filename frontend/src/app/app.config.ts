import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';
import { authInterceptor } from './auth/interceptors/interceptor';
import { AuthStateService } from './auth/services/auth-state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideMarkdown(),
    provideAppInitializer(() => {
      const authState = inject(AuthStateService);
      return authState.initialize();
    }),
  ],
};
