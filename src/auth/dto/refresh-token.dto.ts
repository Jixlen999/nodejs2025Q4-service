import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'refresh_token_string',
    description: 'Refresh token',
    required: false,
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
