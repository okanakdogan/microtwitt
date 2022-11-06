import { Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { User } from '../decorators/user.decorator';

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
