import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  artistId?: string | null; // refers to Artist

  @IsOptional()
  @IsString()
  albumId?: string | null; // refers to Album

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  duration?: number; // integer number
}
