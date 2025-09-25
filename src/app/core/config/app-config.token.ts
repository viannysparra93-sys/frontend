import { InjectionToken } from '@angular/core';

//  Definimos la forma de la configuración de la app
export interface AppConfig {
  production: boolean;
  apiUrl: string;
  useFakeApi: boolean;
}

//  Token que usaremos para inyectar la configuración
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
