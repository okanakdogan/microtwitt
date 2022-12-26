import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[
    ...['TWEET_SERVICE','USER_SERVICE'].map(
      name=> ClientsModule.registerAsync([
        {
          name:name,
          useFactory:(config: ConfigService)=>({
            transport: Transport.NATS,
            options: {
              servers: [config.get("NATS_SERVER")],
            }
          }),
          inject:[ConfigService]
        },
      ])
    )
  ],
  controllers: [SearchController]
})
export class SearchModule {}
