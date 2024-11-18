import {HttpHeaders, HttpInterceptorFn} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token: string = localStorage.getItem('token') ?? '';

  if (token) {
    const header = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    return next(req.clone({headers: header}));
  }

  return next(req);
};
