import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { omitPassword } from '../utils/omit-password';
import { ThrowNotFound } from '../utils/throw-not-found';
import { DbService } from '../db/db.service';
import { PrismaErrorCodes } from '../constants/prisma-error-codes';

@Injectable()
export class UserService {
  constructor(private prisma: DbService) {}

  async findAll() {
    return (await this.prisma.user.findMany()).map((user) =>
      omitPassword(user),
    );
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      ThrowNotFound('User', id);
    }

    return omitPassword(user);
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
      },
    });

    return omitPassword(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { oldPassword, newPassword } = updateUserDto;

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      ThrowNotFound('User', id);
    }

    if (oldPassword !== user.password) {
      throw new ForbiddenException(`Old password is wrong`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: { increment: 1 },
      },
    });

    return omitPassword(updatedUser);
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error.code === PrismaErrorCodes.EntityNotFound) {
        ThrowNotFound('User', id);
      }
    }
  }
}
