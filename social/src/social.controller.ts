import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class SocialController {
  constructor() {}

  @MessagePattern('follow')
  follow(@Payload() data) {
      return 'test';
  }

  @MessagePattern('unfollow')
  unfollow(@Payload() data) {
    
  }

  @MessagePattern('get_follower_list')
  getFollowerList(@Payload() data) {
    
  }

  @MessagePattern('get_following_list')
  getFollowingList(@Payload() data) {
    
  }
}
