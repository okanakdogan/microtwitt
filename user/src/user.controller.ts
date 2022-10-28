import { Controller, UseFilters, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { HttpExceptionFilter } from './filter/http_exception.filter';

@Controller()
export class UserController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ){}

  @MessagePattern('signup')
  async signup(@Payload() data) {
    const pw_hash = await argon2.hash(data.password);

    const user = this.usersRepository.create({
      username: data.username,
      displayName: data.username,
      password_hash: pw_hash,
      email: data.email
    });
    const savedUser = await this.usersRepository.save(user);

    //TODO handle errors and just send success message
    return savedUser
  }

 
  @MessagePattern('login')
  async login(@Payload() data) {
    let user: User;
    if(data.email){
      user = await this.usersRepository.findOneBy({
        email: data.email
      });
    }else{
      user = await this.usersRepository.findOneBy({
        username: data.username
      })
    }
    if(!user){
      throw new BadRequestException('test');
    }
    if(!(await argon2.verify(user.password_hash,data.password))){
      throw new BadRequestException('User not found');
    }
    //TODO return token here
    return user;
  }
}
