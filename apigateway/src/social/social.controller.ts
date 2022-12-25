import { Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { User } from '../decorators/user.decorator';

@ApiTags('Social')
@Controller('social')
export class SocialController {

    constructor(
        @Inject('SOCIAL_SERVICE') private client: ClientProxy,
        @Inject('USER_SERVICE') private userClient: ClientProxy
        ){}

    @Get('followers')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async getFollowers(@User() user){
        const data = { user:user };
        const ids = await firstValueFrom(this.client.send('get_follower_list',data));
        return this.userClient.send('get_users_by_ids',{ ids: ids});
    }

    @Get('following')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async getFollowing(@User() user){
        const data = { user:user };
        const ids = await firstValueFrom(this.client.send('get_following_list',data));
        return this.userClient.send('get_users_by_ids',{ ids: ids});
    }

    @Get('discover_user')
    @UseGuards(AuthGuard('jwt'))
    @ApiQuery({name:'limit', required:false})
    @ApiBearerAuth()
    async discoverUser(@Query('limit',new DefaultValuePipe(10),ParseIntPipe) limit:number, @User() user){
        const data = {user:user, limit:limit};
        const ids = await firstValueFrom(this.client.send('discover_user', data))
        return this.userClient.send('get_users_by_ids', {ids: ids})
    }

    @Post('follow/:user_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    follow(@Param('user_id') target_id:number, @User() user){
        const data = {
            target_user:{id:target_id},
            user:user
        }
        return this.client.send('follow',data);
    }

    @Post('unfollow/:user_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    unfollow(@Param('user_id') target_id:number, @User() user){
        const data = {
            target_user:{id:target_id},
            user:user
        }
        return this.client.send('unfollow',data);
    }
}
