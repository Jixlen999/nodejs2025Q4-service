import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { db } from '../db';
import { randomUUID } from 'crypto';
import { Album } from './entities/album.entity';
import { ThrowNotFound } from 'src/utils/throw-not-found';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    const artist = db.Artists.find(
      (artist) => artist.id === createAlbumDto.artistId,
    );

    const newAlbum: Album = {
      id: randomUUID(),
      ...createAlbumDto,
      artistId: artist ? createAlbumDto.artistId : null,
    };

    db.Albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return db.Albums;
  }

  findOne(id: string) {
    const album = db.Albums.find((artist) => artist.id === id);

    if (!album) {
      ThrowNotFound('Album', id);
    }

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { name, year, artistId } = updateAlbumDto;

    const album = db.Albums.find((album) => album.id === id);

    if (!album) {
      ThrowNotFound('Album', id);
    }

    const artist = db.Artists.find((artist) => artist.id === artistId);

    if (artistId && artist) {
      album.artistId = artistId;
    }
    if (name) {
      album.name = name;
    }
    if (year && year > 0) {
      album.year = year;
    }

    return album;
  }

  remove(id: string) {
    const index = db.Albums.findIndex((album) => album.id === id);

    if (index === -1) {
      ThrowNotFound('Album', id);
    }

    db.Albums.splice(index, 1);

    db.Tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });
  }
}
