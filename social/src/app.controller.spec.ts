import { Test, TestingModule } from '@nestjs/testing';
import { SocialController } from './social.controller';

describe('AppController', () => {
  let socialController: SocialController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SocialController],
    }).compile();

    socialController = app.get<SocialController>(SocialController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(socialController.getHello()).toBe('Hello World!');
    });
  });
});
