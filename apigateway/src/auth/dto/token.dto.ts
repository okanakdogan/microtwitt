import { ApiProperty } from "@nestjs/swagger";

export class TokenDto {
    @ApiProperty({description:'Token of logged-in user'})
    access_token : string;
}