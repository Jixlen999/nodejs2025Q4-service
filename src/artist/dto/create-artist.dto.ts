import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({ example: 'John Doe', description: 'Artist name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: true, description: 'Flag if artist has grammy' })
  @IsBoolean()
  grammy: boolean;
}
