import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entity/tweet.entity';
import { TweetController } from './tweet.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TweetLike } from './entity/tweet_like.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT',5432),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Tweet, TweetLike],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Tweet, TweetLike])
  ],
  controllers: [TweetController]
})
export class AppModule {
  constructor(private dataSource: DataSource){}
}
