import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ThrowNotFound } from '../utils/throw-not-found';
import { DbService } from '../db/db.service';
import { PrismaErrorCodes } from '../constants/prisma-error-codes';

@Injectable()
export class TrackService {
  constructor(private prisma: DbService) {}

  async create(createTrackDto: CreateTrackDto) {
    const newTrack = await this.prisma.track.create({ data: createTrackDto });

    return newTrack;
  }

  async findAll() {
    return this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      ThrowNotFound('Track', id);
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    try {
      const track = await this.prisma.track.update({
        where: { id },
        data: updateTrackDto,
      });

      return track;
    } catch (error) {
      if (error.code === PrismaErrorCodes.EntityNotFound) {
        ThrowNotFound('Track', id);
      }
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.track.delete({ where: { id } });
    } catch (error) {
      if (error.code === PrismaErrorCodes.EntityNotFound) {
        ThrowNotFound('Track', id);
      }
    }
  }
}
