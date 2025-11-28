import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { db } from '../db';
import { ThrowNotFound } from 'src/utils/throw-not-found';
import { Track } from './entities/track.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    const { artistId, albumId } = createTrackDto;

    const artist = db.Artists.some((artist) => artist.id === artistId);
    const album = db.Albums.some((album) => album.id === albumId);

    const newTrack: Track = {
      id: randomUUID(),
      ...createTrackDto,
      artistId: artist ? artistId : null,
      albumId: album ? albumId : null,
    };

    db.Tracks.push(newTrack);

    return newTrack;
  }

  findAll() {
    return db.Tracks;
  }

  findOne(id: string) {
    const track = db.Tracks.find((track) => track.id === id);

    if (!track) {
      ThrowNotFound('Track', id);
    }

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const { artistId, albumId, name, duration } = updateTrackDto;

    const artist = db.Artists.some((artist) => artist.id === artistId);
    const album = db.Albums.some((album) => album.id === albumId);
    const track = db.Tracks.find((track) => track.id === id);

    if (!track) {
      ThrowNotFound('Track', id);
    }

    if (name) {
      track.name = name;
    }
    if (artistId && artist) {
      track.artistId = artistId;
    }
    if (albumId && album) {
      track.albumId = albumId;
    }
    if (duration) {
      track.duration = duration;
    }

    return track;
  }

  remove(id: string) {
    const index = db.Tracks.findIndex((track) => track.id === id);

    if (index === -1) {
      ThrowNotFound('Track', id);
    }

    db.Tracks.splice(index, 1);
  }
}
