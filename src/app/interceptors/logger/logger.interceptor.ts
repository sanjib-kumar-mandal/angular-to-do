import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Logger } from '@utils/logger';
import { API_BASE_PATH } from '@utils/tokens';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBasePath = inject(API_BASE_PATH);
  const method = req.method;
  const url = req.urlWithParams;
  if (url.startsWith(apiBasePath)) {
    Logger.log(`${method}: ${url}`);
  }
  return next(req);
};
