import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AppService } from './app.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

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
    JwtModule.registerAsync({
      useFactory: (config: ConfigService)=>({
        secret: config.get('JWT_SECRET','default_secret'),
      }),
      inject:[ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
