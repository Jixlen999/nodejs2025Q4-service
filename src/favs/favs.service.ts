import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { addEntityToFavs } from '../utils/add-entity-to-favs';
import { removeEntityFromFavs } from '../utils/remove-entity-from-favs';

@Injectable()
export class FavsService {
  findAll() {
    return {
      artists: db.Favs.artists
        .map((id) => db.Artists.find((item) => item.id === id))
        .filter(Boolean),
      albums: db.Favs.albums
        .map((id) => db.Albums.find((item) => item.id === id))
        .filter(Boolean),
      tracks: db.Favs.tracks
        .map((id) => db.Tracks.find((item) => item.id === id))
        .filter(Boolean),
    };
  }

  addTrack(id: string) {
    addEntityToFavs(id, db.Tracks, 'Track', db.Favs.tracks);
  }

  addArtist(id: string) {
    addEntityToFavs(id, db.Artists, 'Artist', db.Favs.artists);
  }

  addAlbum(id: string) {
    addEntityToFavs(id, db.Albums, 'Album', db.Favs.albums);
  }

  removeTrack(id: string) {
    removeEntityFromFavs(id, db.Favs.tracks, 'Track');
  }

  removeArtist(id: string) {
    removeEntityFromFavs(id, db.Favs.artists, 'Artist');
  }
  removeAlbum(id: string) {
    removeEntityFromFavs(id, db.Favs.albums, 'Album');
  }
}
