import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginDto{
    @ApiPropertyOptional()
    username: string;
    @ApiPropertyOptional()
    email: string;
    @ApiProperty()
    password: string;
}