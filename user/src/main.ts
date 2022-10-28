import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions, } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http_exception.filter';

async function bootstrap() {
  //TODO add post host configs
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [ process.env.NATS_SERVER],
      },
    },
  );
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen();
}
bootstrap();
