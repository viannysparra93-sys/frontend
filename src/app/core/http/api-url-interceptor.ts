import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../config/app-config.token';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject<AppConfig>(APP_CONFIG);

  // Verificamos si la URL es absoluta 
  const isAbsolute = /^https?:\/\//i.test(req.url);

  // URL final
  const url = isAbsolute
    ? req.url
    : `${config.apiUrl.replace(/\/$/, '')}/${req.url.replace(/^\//, '')}`;

  // Clonamos la request con la URL ajustada
  const apiReq = req.clone({ url });

  // Log en modo desarrollo
  if (!config.production) {
    console.log(
      '[API Interceptor]',
      'Original URL:', req.url,
      '➡ Final URL:', apiReq.url
    );
  }

  return next(apiReq);
};
