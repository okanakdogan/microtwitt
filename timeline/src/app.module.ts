import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { TimelineController } from './timeline.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (config: ConfigService)=>{
        const store = await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: +config.get('REDIS_PORT'),
          },
          password: config.get('REDIS_PASSWORD'),
        });
    
        return {
          store: {
            create: ()=>store
          },
          ttl: 60 * 60 * 3,
        };
      },
      inject:[ConfigService]
    }),
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
  controllers: [TimelineController],
})
export class AppModule {}
