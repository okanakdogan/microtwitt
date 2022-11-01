import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, of } from 'rxjs';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy){}
  signup(dto) {
    const res = this.client.send('signup',dto);
    return res;
  }

  async login(dto) {
    const login_res = this.client.send('login',dto).pipe(catchError(err=>of(err)));
    const token = await firstValueFrom(login_res)
    const resp : TokenDto = { access_token: token }
    return resp;
  }

}
