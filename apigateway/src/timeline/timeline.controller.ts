import { Controller, Get } from '@nestjs/common';
import { Inject, UseGuards } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';

@Controller('timeline')
export class TimelineController {

    constructor(@Inject('TIMELINE_SERVICE') private client: ClientProxy){}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    getTimeline(@User() user){
        const data = {user:user};
        return this.client.send('get_timeline',data);
    }
}
