import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { apiUrlInterceptor } from './core/http/api-url-interceptor';

import { EquipmentRepository } from './domain/repositories/equipment.repository';
import { EquipmentFakeRepository } from './infrastructure/equipment/equipment-fake.repository';
import { EquipmentHttpRepository } from './infrastructure/equipment/equipment-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([apiUrlInterceptor])),

    {
      provide: EquipmentRepository,
      useClass: environment.useFakeApi
        ? EquipmentFakeRepository   // usa fake en dev
        : EquipmentHttpRepository   // usa http en prod
    }
  ],
};

