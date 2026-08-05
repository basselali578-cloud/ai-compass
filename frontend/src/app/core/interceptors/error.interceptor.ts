import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        if (err.status >= 500 || err.status === 0) {
          const detail = err.status === 0
            ? "Can't reach the server. Check your connection and try again."
            : 'Something went wrong on our end. Please try again in a moment.';
          messageService.add({ severity: 'error', summary: 'Oops', detail });
        }
      }
    })
  );
};
