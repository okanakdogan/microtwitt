import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TweetController } from './tweet.controller';

@Module({
    imports:[
        ClientsModule.registerAsync([
            {
              name:"TWEET_SERVICE",
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
    controllers:[TweetController]
})
export class TweetModule {}
