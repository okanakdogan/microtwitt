import { CACHE_MANAGER, Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { Cache } from 'cache-manager'
import { firstValueFrom } from 'rxjs';
@Controller()
export class TimelineController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('SOCIAL_SERVICE') private socialClient: ClientProxy,
    @Inject('TWEET_SERVICE') private tweetClient: ClientProxy
  ) {}
  private readonly logger = new Logger(TimelineController.name);

  @MessagePattern('get_timeline')
  async getTimeline(@Payload() data) {
    const key = this.getUserTimelineKey(data.user.id);
    let timeline = await this.cacheManager.get(key);
    if (!timeline){
      this.logger.debug('Timeline is not cached')
      timeline = await this.createTimeline(data.user.id);
    }
    return timeline;
  }

  @MessagePattern('update_timeline')
  async updateTimeline(@Payload() data){
    await this.createTimeline(data.user.id);
  }

  async createTimeline(user_id, cache=true){
      const key = this.getUserTimelineKey(user_id);

      const followings = await firstValueFrom(
        await this.socialClient.send('get_following_list',{user:{id:user_id}})
      );

      const timeline = await firstValueFrom(
        await this.tweetClient.send('tweets_by_user_ids',{user_ids:followings})
      );
      this.cacheManager.set(key,timeline);
      return timeline;
  }
  getUserTimelineKey(user_id){
    return `${user_id}_timeline`;
  }
}
