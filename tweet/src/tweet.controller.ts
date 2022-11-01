import { BadRequestException, Controller } from '@nestjs/common';
import { NotFoundException, NotImplementedException } from '@nestjs/common/exceptions';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Tweet } from './entity/tweet.entity';

@Controller()
export class TweetController {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>
  ) {}

  @MessagePattern('post_tweet')
  async postTweet(@Payload() data) {
    
    const tweet = this.tweetRepository.create({
      text: data.tweet.text,
      user_id: data.user.id
    })

    try {
      const savedTweet = await this.tweetRepository.save(tweet);
      //TODO add a flow for updating timeline
      return savedTweet;
    } catch (error) {
      if(error instanceof QueryFailedError){
        throw new BadRequestException('Tweet post failed');
      }
    }
  }

  @MessagePattern('delete_tweet')
  async deleteTweet(@Payload() data) {
    
    const res = await this.tweetRepository.delete({
      id: data.tweet.id,
      user_id: data.user.id
    })
    if(res.affected===0){
      throw new NotFoundException('Tweet not found');
    }
    //TODO add a flow for updating timeline
    return { status: 'OK' };
  }

  @MessagePattern('like_tweet')
  async likeTweet(@Payload() data) {
    throw new NotImplementedException();
  }
}
