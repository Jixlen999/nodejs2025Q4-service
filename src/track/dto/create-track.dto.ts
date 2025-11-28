import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ example: 'My track', description: 'Track name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Artist uuid',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  artistId: string | null; // refers to Artist

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Album uuid',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  albumId: string | null; // refers to Album

  @ApiProperty({ example: '60', description: 'Duration' })
  @IsInt()
  @IsNotEmpty()
  duration: number; // integer number
}
