import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ example: 'My album', description: 'Album name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2025, description: 'Release year' })
  @IsNumber()
  year: number;

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Artist uuid',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  artistId: string | null; // refers to Artist
}
