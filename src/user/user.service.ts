import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { db } from '../db';
import { randomUUID } from 'crypto';
import { omitPassword } from '../utils/omit-password';

@Injectable()
export class UserService {
  findAll() {
    return db.Users.map((user) => omitPassword(user));
  }

  findOne(id: string) {
    const user = db.Users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return omitPassword(user);
  }

  create(createUserDto: CreateUserDto) {
    const now = Date.now();
    const newUser = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    db.Users.push(newUser);

    return omitPassword(newUser);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { oldPassword, newPassword } = updateUserDto;

    const user = db.Users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    if (oldPassword !== user.password) {
      throw new ForbiddenException(`Old password is wrong`);
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return omitPassword(user);
  }

  remove(id: string) {
    const index = db.Users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    db.Users.splice(index, 1);
  }
}
