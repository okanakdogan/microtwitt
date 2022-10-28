import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    ClientsModule.registerAsync([
      {
        name:"USER_SERVICE",
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
