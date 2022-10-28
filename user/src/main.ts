import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  //TODO add post host configs
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        //servers: ['nats://nats:4222'],
        servers: [ process.env.NATS_SERVER],
      },
    },
  );
  
  await app.listen();
}
bootstrap();
