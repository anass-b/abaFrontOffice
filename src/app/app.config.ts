import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
//import { authInterceptor } from './services/auth/interceptor/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from '@auth0/angular-jwt';
import { DatePipe } from '@angular/common';
//import { httpSpinnerInterceptor } from './interceptors/httpSpinner/http-spinner.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  provideHttpClient(
    withFetch(),
   /* withInterceptors([
    authInterceptor,
    httpSpinnerInterceptor
  ])*/),
  DatePipe,
  importProvidersFrom([
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token')
      }
    })
  ]), provideAnimationsAsync()]
};
