import { ClientNats } from "@nestjs/microservices";
import { catchError, Observable, of } from "rxjs";

export class ClientNatsProxyWithErrHandler extends ClientNats{
    
    public send<TResult = any, TInput = any>(
        pattern: any,
        data: TInput,
      ): Observable<TResult>{
        return super.send(pattern,data).pipe(catchError(err=>of(err)))
      }

}