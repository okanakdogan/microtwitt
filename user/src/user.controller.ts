import { Controller, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload,  } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository, QueryFailedError, In } from 'typeorm';
import { User } from './entity/user.entity';

@Controller()
export class UserController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
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

    try {
      const savedUser = await this.usersRepository.save(user);
      return savedUser;
    } catch (error) {
      if(error instanceof QueryFailedError){
        throw new BadRequestException('Signup failed. Please check inputs');
      }
    }
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
      throw new BadRequestException('User not found');
    }
    if(!(await argon2.verify(user.password_hash,data.password))){
      throw new BadRequestException('User not found');
    }
    const token = this.createTokenForUser(user);
    return token;
  }

  @MessagePattern('get_user_by_token_payload')
  async getUserByPayload(@Payload() payload) {
    const user = this.usersRepository.findOneBy({id: payload.sub});
    return user;
  }

  @MessagePattern('get_users_by_ids')
  async getUserByIds(@Payload() data) {
    const users = await this.usersRepository.findBy({id: In(data.ids)});
    users.forEach((u)=>{delete u.password_hash})
    return users;
  }

  createTokenForUser(user: User){
    const payload = { sub: user.id };
    return this.jwtService.sign(payload);
  }
}
