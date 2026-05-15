import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { successResponse } from '../response/api-response';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'code' in (data as Record<string, unknown>) && 'status' in (data as Record<string, unknown>)) {
          return data;
        }
        return successResponse(data as T);
      }),
    );
  }
}
