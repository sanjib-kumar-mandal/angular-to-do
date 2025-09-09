import { HttpInterceptorFn } from '@angular/common/http';

export const cookieInterceptor: HttpInterceptorFn = (req, next) => {
  // Attach withCredentials = true
  // So that it can carries cookies with requests
  const clonedReq = req.clone({
    withCredentials: true,
  });
  return next(clonedReq);
};
