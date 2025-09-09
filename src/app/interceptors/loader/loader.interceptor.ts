import {
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '@services/loader/loader.service';
import { catchError, map } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  loader.setLoading(true, req.url);
  return next(req).pipe(
    catchError((err) => {
      loader.setLoading(false, req.url);
      throw err;
    }),
    map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
      if (evt instanceof HttpResponse) {
        loader.setLoading(false, req.url);
      }
      return evt;
    })
  );
};
