import { Body, Controller, HttpCode, HttpStatus, Post,Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({description:'Sign up with mail'})
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiBody({type: SignUpDto})
  signup(@Body() dto: SignUpDto) {
    return this.appService.signup(dto);
  }

  @ApiOperation({description:'Login with mail'})
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({type: LoginDto})
  @ApiOkResponse()
  login(@Body() dto: LoginDto){
    return this.appService.login(dto);
  }


  @Get('test')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  test(){
    return 'test'
  }
}
