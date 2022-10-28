import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { ClientNatsProxyWithErrHandler } from './clientproxy/client_proxy_filter';

@Injectable()
export class AppService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy){}
  signup(dto) {
    const res = this.client.send('signup',dto);
    return res;
  }

  login(dto) {
    const res = this.client.send('login',dto).pipe(catchError(err=>of(err)));
    return res;
  }
}
