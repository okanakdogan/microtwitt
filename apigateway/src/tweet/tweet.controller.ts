import { Body, Controller, Delete, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { DeleteTweetDto } from './dto/delete_tweet.dto';
import { PostTweetDto } from './dto/post_tweet.dto';

@ApiTags('Tweet')
@Controller()
export class TweetController {
  constructor(@Inject('TWEET_SERVICE') private client: ClientProxy ) {}

  @Post('tweet')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  postTweet(@Body() dto: PostTweetDto, @User() user){
    const data = {
      user: user,
      tweet: dto
    }
    return this.client.send('post_tweet',data);
  }

  @Delete('tweet')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  deleteTweet(@Body() dto: DeleteTweetDto, @User() user){
    const data = {
      user: user,
      tweet: dto
    }
    return this.client.send('delete_tweet',data);
  }

  
}
