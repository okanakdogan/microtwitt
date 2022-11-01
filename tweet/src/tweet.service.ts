import { Injectable } from '@nestjs/common';

@Injectable()
export class TweetService {
  getHello(): string {
    return 'Hello World!';
  }
}
