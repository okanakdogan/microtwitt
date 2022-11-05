import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { HttpException, NotFoundException, NotImplementedException } from '@nestjs/common/exceptions';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { Tweet } from './entity/tweet.entity';
import { TweetLike } from './entity/tweet_like.entity';

@Controller()
export class TweetController {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
    @InjectRepository(TweetLike)
    private tweetLikeRepository: Repository<TweetLike>,
    private dataSource: DataSource
  ) {}

  private readonly logger = new Logger(TweetController.name);

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
    
    //Note: I've hope that Typeorm has a primary column check for same entity creation and give an error at db level
    // But I couldn't find it, create statement executes successfully even entity 
    const existLikedTweet = await this.tweetLikeRepository.findOneBy({
      user_id: data.user.id,
      tweet_id: data.tweet.id
    });
    if(existLikedTweet){
      throw new BadRequestException('Already liked');
    }

    const likedTweet = await this.tweetLikeRepository.create({
      user_id: data.user.id,
      tweet_id: data.tweet.id
    });
    // Note: Do I need to connect & release every time for liking a tweet?
    // Consider create a query runner with constructor and release it service destroy!
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let res;
    try {
      await queryRunner.manager.create(TweetLike,likedTweet);
      await queryRunner.manager.increment(Tweet,{id:data.tweet.id},'like_count',1);

      await queryRunner.commitTransaction();
      res = { status: 'OK'}

    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      res = new NotFoundException('Tweet not found');

    }finally{
      await queryRunner.release();
    }

    if(res instanceof HttpException){
      throw res;
    }
    else{
      return res;
    }
  }

  @MessagePattern('unlike_tweet')
  async unlikeTweet(@Payload() data) {

    const existLikedTweet = await this.tweetLikeRepository.findOneBy({
      user_id: data.user.id,
      tweet_id: data.tweet.id
    });

    if(!existLikedTweet){
      throw new BadRequestException('Tweet like does not exist');
    }

    const likedTweet = await this.tweetLikeRepository.findOneBy({
      user_id: data.user.id,
      tweet_id: data.tweet.id
    });

    //const theTweet = await this.tweetRepository.findOneBy({id:data.tweet.id})
    //theTweet.like_count+=1;
    
    // Note: Do I need to connect & release every time for liking a tweet?
    // Consider create a query runner with constructor and release it service destroy!
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let res;
    try {
      await queryRunner.manager.remove(likedTweet);
      //await queryRunner.manager.save(theTweet);
      await queryRunner.manager.decrement(Tweet,{id:data.tweet.id},'like_count',1)
      await queryRunner.commitTransaction();
      res = { status: 'OK'}
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      res =  new NotFoundException('Tweet not found');
    }finally{
      await queryRunner.release();
    }

    if(res instanceof HttpException){
      throw res;
    }
    else{
      return res;
    }
  }
}
