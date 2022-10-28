import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  @ApiBody({type: SignUpDto})
  signup(@Body() dto: SignUpDto) {
    return this.appService.signup(dto);
  }

  @Post('login')
  @ApiBody({type: LoginDto})
  login(@Body() dto: LoginDto){
    return this.appService.login(dto)
  }
}
