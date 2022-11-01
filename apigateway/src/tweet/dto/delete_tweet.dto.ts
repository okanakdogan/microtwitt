import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class DeleteTweetDto{
    
    @ApiProperty({description:'Id of the tweet to delete'})
    @IsUUID()
    id: string;
}