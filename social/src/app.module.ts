import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';

@Module({
  imports: [],
  controllers: [SocialController],
})
export class AppModule {}
