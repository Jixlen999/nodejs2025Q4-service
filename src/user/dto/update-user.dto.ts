import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'OldPassword123', description: 'User old password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string; // previous password

  @ApiProperty({ example: 'NewPassword123', description: 'User new password' })
  @IsString()
  @IsNotEmpty()
  newPassword: string; // new password
}
