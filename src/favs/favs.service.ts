import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class FavsService {
  constructor(private prisma: DbService) {}

  async findAll() {
    const favs = await this.prisma.fav.findUnique({
      where: { id: 'favs' },
    });

    if (!favs) {
      return { artists: [], albums: [], tracks: [] };
    }

    return {
      artists: await this.prisma.artist.findMany({
        where: { id: { in: favs.artists } },
      }),
      albums: await this.prisma.album.findMany({
        where: { id: { in: favs.albums } },
        select: {
          id: true,
          name: true,
          year: true,
          artistId: true,
        },
      }),
      tracks: await this.prisma.track.findMany({
        where: { id: { in: favs.tracks } },
        select: {
          id: true,
          name: true,
          duration: true,
          artistId: true,
          albumId: true,
        },
      }),
    };
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} does not exist`,
      );
    }

    const favs = await this.getOrCreateFavs();

    if (favs.tracks.includes(id)) {
      return { message: 'Track already in favorites' };
    }

    await this.prisma.fav.update({
      where: { id: 'favs' },
      data: {
        tracks: { push: id },
      },
    });

    return { message: 'Track added to favorites' };
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} does not exist`,
      );
    }

    const favs = await this.getOrCreateFavs();

    if (favs.artists.includes(id)) {
      return { message: 'Artist already in favorites' };
    }

    await this.prisma.fav.update({
      where: { id: 'favs' },
      data: {
        artists: { push: id },
      },
    });

    return { message: 'Artist added to favorites' };
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} does not exist`,
      );
    }

    const favs = await this.getOrCreateFavs();

    if (favs.albums.includes(id)) {
      return { message: 'Album already in favorites' };
    }

    await this.prisma.fav.update({
      where: { id: 'favs' },
      data: {
        albums: { push: id },
      },
    });

    return { message: 'Album added to favorites' };
  }

  async removeTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} does not exist`,
      );
    }

    const favs = await this.getOrCreateFavs();

    if (!favs.tracks.includes(id)) {
      throw new UnprocessableEntityException(
        `Track with id ${id} is not in favorites`,
      );
    }

    await this.prisma.fav.update({
      where: { id: 'favs' },
      data: {
        tracks: favs.tracks.filter((trackId) => trackId !== id),
      },
    });

    return { message: 'Track removed from favorites' };
  }

  async removeArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} does not exist`,
      );
    }

    const favs = await this.getOrCreateFavs();

    if (!favs.artists.includes(id)) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} is not in favorites`,
      );
    }

    await this.prisma.fav.update({
      where: { id: 'favs' },
      data: {
        artists: favs.artists.filter((artistId) => artistId !== id),
      },
    });

    return { message: 'Artist removed from favorites' };
  }

  async removeAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} does not exist`,
      );
    }

    const favs = await this.getOrCreateFavs();

    if (!favs.albums.includes(id)) {
      throw new UnprocessableEntityException(
        `Album with id ${id} is not in favorites`,
      );
    }

    await this.prisma.fav.update({
      where: { id: 'favs' },
      data: {
        albums: favs.albums.filter((albumId) => albumId !== id),
      },
    });

    return { message: 'Album removed from favorites' };
  }

  private async getOrCreateFavs() {
    let favs = await this.prisma.fav.findUnique({
      where: { id: 'favs' },
    });

    if (!favs) {
      favs = await this.prisma.fav.create({
        data: {
          id: 'favs',
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }

    return favs;
  }
}
