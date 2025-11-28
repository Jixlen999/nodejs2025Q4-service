import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { User } from '../user/entities/user.entity';

type DB = {
  Users: User[];
  Tracks: Track[];
  Artists: Artist[];
  Albums: Album[];
};

export const db: DB = {
  Users: [],
  Tracks: [],
  Artists: [],
  Albums: [],
};
