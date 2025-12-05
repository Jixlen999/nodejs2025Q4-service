import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ThrowNotFound } from '../utils/throw-not-found';
import { DbService } from '../db/db.service';
import { PrismaErrorCodes } from '../constants/prisma-error-codes';

@Injectable()
export class ArtistService {
  constructor(private prisma: DbService) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = await this.prisma.artist.create({
      data: createArtistDto,
    });

    return newArtist;
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      ThrowNotFound('Artist', id);
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    try {
      const updatedArtist = await this.prisma.artist.update({
        where: { id },
        data: { ...updateArtistDto },
      });

      return updatedArtist;
    } catch (error) {
      if (error.code === PrismaErrorCodes.EntityNotFound) {
        ThrowNotFound('Artist', id);
      }
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.album.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      });

      await this.prisma.track.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      });

      await this.prisma.artist.delete({ where: { id } });

      return true;
    } catch (error) {
      if (error.code === PrismaErrorCodes.EntityNotFound) {
        ThrowNotFound('Artist', id);
      }
    }
  }
}
