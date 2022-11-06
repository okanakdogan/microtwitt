import { BadRequestException, Controller, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Neo4jService } from '@nhogs/nestjs-neo4j/dist';

@Controller()
export class SocialController {
  constructor(private readonly neo4j : Neo4jService) {}

  @MessagePattern('follow')
  async follow(@Payload() data) {
    //TODO check user ids with user service. with Merge clause, you are creating nodes and properties based on user input!
    // Note: Create user nodes at signup phase but you need a transaction mech. to sync user and social databases
    const queryResult = await this.neo4j.run({
        cypher: 'MERGE (user:User {id:$user_id}) -[r:FOLLOW  {created: date()}]-> (target:User {id:$target_id}) RETURN r',
        parameters:{
          user_id: parseInt(data.user.id),
          target_id: parseInt(data.target_user.id)
        }
      },
      {write: true}
    );
    if(queryResult.records.length===0){
      throw new InternalServerErrorException('Could not create follow relation');
    }
    if(queryResult.records.length===1 && queryResult.summary.counters.updates().relationshipsCreated==0){
      throw new BadRequestException('Already following');
    }
    const result = queryResult.summary.counters.updates().relationshipsCreated>0;
    return {status: result ? 'OK':'NOK'};
  }

  @MessagePattern('unfollow')
  async unfollow(@Payload() data) {
    const queryResult = await this.neo4j.run({
        cypher: 'MATCH (user:User {id:$user_id})-[r:FOLLOW]-> (target:User {id:$target_id}) DELETE r  RETURN r',
        parameters:{
          user_id: parseInt(data.user.id),
          target_id: parseInt(data.target_user.id)
        }
      },
      {write: true}
    );
    if(queryResult.records.length===0){
      throw new NotFoundException('Follow relation not found');
    }
    const res = queryResult.summary.counters.updates().relationshipsDeleted>0;
    return { status: res ? 'OK': 'NOK'}

  }

  @MessagePattern('get_follower_list')
  async getFollowerList(@Payload() data) {
    const queryResult = await this.neo4j.run({
        cypher: 'MATCH (user:User {id:$user_id})<-[r:FOLLOW]- (n:User) RETURN n',
        parameters:{
          user_id: parseInt(data.user.id),
        }
      },
      {write: true}
    );
    const ids = queryResult.records.map((elem)=>{ return elem.get('n').properties.id})
    return ids;
  }

  @MessagePattern('get_following_list')
  async getFollowingList(@Payload() data) {
    const queryResult = await this.neo4j.run({
        cypher: 'MATCH (user:User {id:$user_id})-[r:FOLLOW]-> (n:User) RETURN n',
        parameters:{
          user_id: parseInt(data.user.id),
        }
      },
      {write: true}
    );
    const ids = queryResult.records.map((elem)=>{ return elem.get('n').properties.id})
    return ids;
  }
}
