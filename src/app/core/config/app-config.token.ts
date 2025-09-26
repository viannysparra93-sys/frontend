import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

// Interfaz de configuración de la app
export interface AppConfig {
  production: boolean;
  apiUrl: string;
  useFakeApi: boolean;
}

// Token de inyección
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');


export const APP_CONFIG_VALUE: AppConfig = {
  production: environment.production,
  apiUrl: environment.apiUrl,
  useFakeApi: environment.useFakeApi,
};
