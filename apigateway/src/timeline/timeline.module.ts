import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TimelineController } from './timeline.controller';

@Module({
  imports:[
    ClientsModule.registerAsync([
        {
          name:"TIMELINE_SERVICE",
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
  controllers: [TimelineController]
})
export class TimelineModule {}
