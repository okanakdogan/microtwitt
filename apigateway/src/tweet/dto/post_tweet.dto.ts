import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class PostTweetDto{
    @ApiProperty({description:'Text message of Tweet'})
    @Length(1,280)
    text: string;
}