import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../config/app-config.token';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject<AppConfig>(APP_CONFIG);

  // Si la URL empieza con /api → le antepone el apiUrl definido en environment
  if (req.url.startsWith('/api')) {
    const apiReq = req.clone({
      url: `${config.apiUrl}${req.url}`
    });
    return next(apiReq);
  }

  return next(req);
};
