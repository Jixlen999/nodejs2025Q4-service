import { UnprocessableEntityException } from '@nestjs/common';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';

export const addEntityToFavs = (
  id: string,
  source: Track[] | Album[] | Artist[],
  entityTitle: string,
  target: string[],
) => {
  const entity = source.find((item) => item.id === id);

  if (!entity) {
    throw new UnprocessableEntityException(
      `${entityTitle} with id ${id} does not exist`,
    );
  }

  if (!target.includes(id)) {
    target.push(id);
  }

  return { message: `${entityTitle} added to favorites` };
};
