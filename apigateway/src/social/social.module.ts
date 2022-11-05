import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SocialController } from './social.controller';

@Module({
  imports:[
    ClientsModule.registerAsync([
        {
          name:"SOCIAL_SERVICE",
          useFactory:(config: ConfigService)=>({
            transport: Transport.NATS,
            options: {
              servers: [config.get("NATS_SERVER")],
            }
          }),
          inject:[ConfigService]
        },
      ]),
],
  controllers: [SocialController]
})
export class SocialModule {}
