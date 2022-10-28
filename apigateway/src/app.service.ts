import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy){}
  signup() {
    const res = this.client.send('signup',{ some:'data'});
    return res;
  }
}
