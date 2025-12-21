import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({
    summary: 'Register new user',
  })
  @ApiResponse({
    status: 201,
    description: 'Record created',
  })
  @ApiResponse({
    status: 400,
    description:
      'Dto is invalid (no login or password, or they are not a strings',
  })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get access and refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Return tokens',
  })
  @ApiResponse({
    status: 400,
    description:
      'Dto is invalid (no login or password, or they are not a strings',
  })
  @ApiResponse({
    status: 403,
    description:
      'Authentication failed (no user with such login, password does not match actual one, etc.)',
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Send refresh token in body as { refreshToken } to get new pair of Access token and Refresh token',
  })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 401, description: 'No refresh token provided' })
  @ApiResponse({ status: 403, description: 'Invalid or expired refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }
}
