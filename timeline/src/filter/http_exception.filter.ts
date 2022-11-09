import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    return throwError(() => exception.getResponse());
    
  }
}