import { Controller, DefaultValuePipe, Get, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@ApiTags('Search')
@Controller('search')
export class SearchController {

    constructor(
        @Inject('TWEET_SERVICE') private tweetClient: ClientProxy,
        @Inject('USER_SERVICE') private userClient: ClientProxy
    ){}

    @Get('autocomplete')
    async autocomplete(@Query('keyword') keyword:string){
        const data = {keyword:keyword};
        const tweetCount = await firstValueFrom(this.tweetClient.send('tweet_count_by_keyword',data));
        const userList = await firstValueFrom(this.userClient.send('search_users_by_name',data));
        const result ={
            keyword,
            tweetCount,
            userList
        }
        return result;
    }

    @ApiQuery({name:'skip',required:false})
    @ApiQuery({name:'take',required:false})
    @Get('tweet')
    async searchTweet(
        @Query('keyword') keyword:string,
        @Query('skip',new DefaultValuePipe(0),ParseIntPipe) skip:number,
        @Query('take',new DefaultValuePipe(20),ParseIntPipe) take:number
    ){
        const data = {keyword:keyword,skip:skip,take:take};        
        return this.tweetClient.send('search_by_keyword',data);
    }
    
}
