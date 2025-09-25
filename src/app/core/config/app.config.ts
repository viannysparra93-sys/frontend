import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from '../../app.routes';
import { environment } from '../../../environments/environment';
import { apiUrlInterceptor } from '../http/api-url-interceptor';

import { EquipmentRepository } from '../../domain/repositories/equipment.repository';
import { EquipmentFakeRepository } from '../../infrastructure/equipment/equipment-fake.repository';
import { EquipmentHttpRepository } from '../../infrastructure/equipment/equipment-http.repository';

export interface AppConfig {
  apiUrl: string;
  useFakeApi: boolean;
}

const APP_CONFIG_VALUE: AppConfig = {
  apiUrl: environment.apiUrl,
  useFakeApi: environment.useFakeApi
};


export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiUrlInterceptor])
    ),

    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },

   
    {
      provide: EquipmentRepository,
      useClass: environment.useFakeApi
        ? EquipmentFakeRepository   // si useFakeApi = true
        : EquipmentHttpRepository   // si useFakeApi = false
    }
  ],
};
