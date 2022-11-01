import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports:[
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
          ])
    ],
    providers:[AuthService],
    controllers:[AuthController],
    exports:[ClientsModule]
})
export class AuthModule {}
