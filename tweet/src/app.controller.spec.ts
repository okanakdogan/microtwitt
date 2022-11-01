import { Test, TestingModule } from '@nestjs/testing';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';

describe('TweetController', () => {
  let tweetController: TweetController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TweetController],
      providers: [TweetService],
    }).compile();

    tweetController = app.get<TweetController>(TweetController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(tweetController.getHello()).toBe('Hello World!');
    });
  });
});
