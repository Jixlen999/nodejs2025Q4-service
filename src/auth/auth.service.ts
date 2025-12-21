import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DbService } from 'src/db/db.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: DbService) {}

  private readonly accessSecret = process.env.JWT_SECRET_KEY || 'access_secret';
  private readonly refreshSecret =
    process.env.JWT_SECRET_REFRESH_KEY || 'refresh_secret';
  private readonly accessExpiresIn =
    (process.env.TOKEN_EXPIRE_TIME as any) || ('15m' as any);
  private readonly refreshExpiresIn =
    (process.env.TOKEN_REFRESH_EXPIRE_TIME as any) || ('7d' as any);

  async signup(createUserDto: CreateUserDto) {
    const saltRounds = Number(process.env.CRYPT_SALT) || 10;

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: hashedPassword,
        version: 1,
      },
    });

    return {
      statusCode: 201,
      message: 'User created successfully',
      id: user.id,
      login: user.login,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { login: loginUserDto.login },
    });

    if (!user) {
      throw new ForbiddenException('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid login or password');
    }

    const accessToken = jwt.sign(
      { userId: user.id, login: user.login },
      this.accessSecret,
      { expiresIn: this.accessExpiresIn },
    );

    const refreshToken = jwt.sign(
      { userId: user.id, login: user.login },
      this.refreshSecret,
      { expiresIn: this.refreshExpiresIn },
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    return {
      statusCode: 200,
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    if (
      !refreshTokenDto.refreshToken ||
      refreshTokenDto.refreshToken.trim() === ''
    ) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = jwt.verify(
        refreshTokenDto.refreshToken,
        this.refreshSecret,
      ) as any;

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.userId,
          refreshToken: refreshTokenDto.refreshToken,
        },
      });

      if (!user) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, login: user.login },
        this.accessSecret,
        { expiresIn: this.accessExpiresIn },
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id, login: user.login },
        this.refreshSecret,
        { expiresIn: this.refreshExpiresIn },
      );

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        statusCode: 200,
        message: 'Tokens refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ForbiddenException('Refresh token expired');
      }
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
