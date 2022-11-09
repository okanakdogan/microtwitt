import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TweetModule } from './tweet/tweet.module';
import { SocialModule } from './social/social.module';
import { TimelineModule } from './timeline/timeline.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService)=>({
        secret: config.get('JWT_SECRET','default_secret'),
      }),
      inject:[ConfigService]
    }),
    AuthModule,
    TweetModule,
    SocialModule,
    TimelineModule
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
