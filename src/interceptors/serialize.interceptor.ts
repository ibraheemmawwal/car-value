import { from } from 'rxjs';
import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<T> {
    // Run something before a request is handled by the request handler

    return handler.handle().pipe(
      map((data: T) => {
        // Run something before the response is sent out

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
