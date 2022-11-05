import { Controller, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';

@Controller('social')
export class SocialController {

    constructor(@Inject('SOCIAL_SERVICE') private client: ClientProxy){}

    @Post('follow/:user_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    follow(@Param('user_id') target_id:string, @User() user){
        const data = {
            target_user:{id:target_id},
            user:user
        }
        return this.client.send('follow',data);
    }

}
