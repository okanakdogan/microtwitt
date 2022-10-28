import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('signup')
  signup(@Payload() data, @Ctx() context: NatsContext) {
    return this.appService.signup(data);
  }
}
