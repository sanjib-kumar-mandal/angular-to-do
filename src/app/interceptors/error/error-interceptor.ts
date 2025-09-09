import { DOCUMENT } from '@angular/common';
import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const doc = inject(DOCUMENT);
  return next(req).pipe(
    catchError((err) => {
      if (err.status === HttpStatusCode.Unauthorized) {
        router.navigate(['/auth/login'], {
          queryParams: { redirectURL: encodeURI(doc.URL) },
        });
      } else if (err.status === HttpStatusCode.ServiceUnavailable) {
        router.navigate(['/server-maintenance']);
      }
      return throwError(() => err);
    })
  );
};
