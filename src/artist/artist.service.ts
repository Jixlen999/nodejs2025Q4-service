import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { db } from '../db';
import { ThrowNotFound } from '../utils/throw-not-found';
// import { randomUUID } from 'crypto';
// import { Artist } from './entities/artist.entity';
import { DbService } from '../db/db.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: DbService) {}

  create(createArtistDto: CreateArtistDto) {
    // const newArtist: Artist = {
    //   id: randomUUID(),
    //   ...createArtistDto,
    // };

    const newArtist = this.prisma.artist.create({
      data: createArtistDto,
    });

    return newArtist;
  }

  findAll() {
    return db.Artists;
  }

  findOne(id: string) {
    const artist = db.Artists.find((artist) => artist.id === id);

    if (!artist) {
      ThrowNotFound('Artist', id);
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = db.Artists.find((artist) => artist.id === id);

    if (!artist) {
      ThrowNotFound('Artist', id);
    }

    return Object.assign(artist, updateArtistDto);
  }

  remove(id: string) {
    const index = db.Artists.findIndex((artist) => artist.id === id);

    if (index === -1) {
      ThrowNotFound('Artist', id);
    }

    db.Artists.splice(index, 1);

    db.Tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });

    db.Albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
  }
}
