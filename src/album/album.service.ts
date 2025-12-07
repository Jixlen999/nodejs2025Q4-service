import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ThrowNotFound } from 'src/utils/throw-not-found';
import { DbService } from 'src/db/db.service';
import { PrismaErrorCodes } from '../constants/prisma-error-codes';

@Injectable()
export class AlbumService {
  constructor(private prisma: DbService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data: createAlbumDto,
    });

    return newAlbum;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      ThrowNotFound('Album', id);
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    try {
      const newAlbum = await this.prisma.album.update({
        where: { id },
        data: { ...updateAlbumDto },
      });

      return newAlbum;
    } catch (error) {
      if (error.code === PrismaErrorCodes.EntityNotFound) {
        ThrowNotFound('Album', id);
      }
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.track.updateMany({
        where: { albumId: id },
        data: { albumId: null },
      });
      await this.prisma.album.delete({ where: { id } });
    } catch (error) {
      if (error.code === PrismaErrorCodes.EntityNotFound) {
        ThrowNotFound('Album', id);
      }
    }
  }
}
