import { Injectable, NestInterceptor, ExecutionContext, Logger, CallHandler } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): any {
        const now = Date.now();
        const { path } = context.getArgByIndex(3);

        return next.handle().pipe(
            tap(() => {
                Logger.log(
                    `[Method: ${path.key}] [Type: ${path.typename}] - ${Date.now() - now}ms`,
                    context.getClass().name
                );
            })
        );
    }
}
