import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EntityManager, ILike, In, QueryFailedError } from 'typeorm';
import { Tweet } from './entity/tweet.entity';
import { TweetLike } from './entity/tweet_like.entity';

@Controller()
export class TweetController {
  constructor(
    private entityManager: EntityManager
  ) {}

  private readonly logger = new Logger(TweetController.name);


  @MessagePattern('user_tweets')
  async getTweet(@Payload() data) {
    const tweets = this.entityManager.findBy(Tweet,{user_id:data.user.id});
    return tweets;
  }
  
  @MessagePattern('tweets_by_user_ids')
  async getTweetsByUserIds(@Payload() data) {
    const ids = data.user_ids;
    if(!ids || ids.length===0){
      return [];
    }
    const take = data.take || 100;
    const skip = data.skip || 0;
    const tweets = this.entityManager.find(Tweet,{
       where:{ user_id: In(ids)},
       order:{
        created_at:"DESC"
       },
       take:take,
       skip:skip
    });
    return tweets;
  }

  @MessagePattern('post_tweet')
  async postTweet(@Payload() data) {
    const tweet = this.entityManager.create(Tweet,{
      text: data.tweet.text,
      user_id: data.user.id
    })

    try {
      const savedTweet = await this.entityManager.save(tweet); //await this.tweetRepository.save(tweet);
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
    const res = await this.entityManager.delete(Tweet,{
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
    //Note: I've hope that Typeorm has a primary column check for same entity creation and give an error at db level
    // But I couldn't find it, create statement executes successfully even entity 
    const existLikedTweet = await this.entityManager.findOneBy(TweetLike,{
      user_id: data.user.id,
      tweet_id: data.tweet.id
    });

    if(existLikedTweet){
      throw new BadRequestException('Already liked');
    }

    await this.entityManager.transaction(async (manager) =>{
        const likedTweet = manager.create(TweetLike,{
          user_id: data.user.id,
          tweet_id: data.tweet.id
        });
        await manager.save(likedTweet);
        await manager.increment(Tweet,{ id: data.tweet.id },'like_count',1);
      });
      return {status:'OK'}
  }

  @MessagePattern('unlike_tweet')
  async unlikeTweet(@Payload() data) {

    const existLikedTweet = await this.entityManager.findOneBy(TweetLike,{
      user_id: data.user.id,
      tweet_id: data.tweet.id
    });

    if(!existLikedTweet){
      throw new BadRequestException('Tweet like does not exist');
    }

    await this.entityManager.transaction(async (manager) =>{
        await manager.delete(TweetLike,{
          user_id: data.user.id,
          tweet_id: data.tweet.id
        });
        await manager.decrement(Tweet,{ id: data.tweet.id },'like_count',1);
    });
    return {status:'OK'};
  }

  @MessagePattern('tweet_count_by_keyword')
  async tweetCountByKeyword(@Payload() data){
    return await this.entityManager.count(Tweet,{
      where:{
        text:ILike(`%${data.keyword}%`)
      }
    })
  }

  @MessagePattern('search_by_keyword')
  async searchByKeyword(@Payload() data){
    return await this.entityManager.find(Tweet,{
      where:{
        text:ILike(`%${data.keyword}%`)
      },
      skip:data.skip,
      take:data.take
    })
  }
}
