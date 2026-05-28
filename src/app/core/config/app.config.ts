import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from '../../app.routes';
import { apiUrlInterceptor } from '../http/api-url-interceptor';
import { APP_CONFIG, APP_CONFIG_VALUE } from './app-config.token';
import { provideEquipmentRepository } from '../../infrastructure/equipment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },

    provideHttpClient(
      withFetch(),
      withInterceptors([apiUrlInterceptor])
    ),

    provideEquipmentRepository(),
  ],
};
