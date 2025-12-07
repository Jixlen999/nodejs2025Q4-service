import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all favorites',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns all favorite records (not their ids), split by entity type',
  })
  findAll() {
    return this.favsService.findAll();
  }

  @Post('track/:id')
  @ApiOperation({
    summary: 'Add track to the favorites',
  })
  @ApiResponse({
    status: 201,
    description: 'Track exists and added to favorites',
  })
  @ApiResponse({ status: 400, description: 'TrackId is invalid (not uuid)' })
  @ApiResponse({
    status: 422,
    description: 'Track with id === trackId does not exist',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete track from favorites',
  })
  @ApiResponse({
    status: 204,
    description: 'Track was in favorites and now it is deleted',
  })
  @ApiResponse({ status: 400, description: 'TrackId is invalid (not uuid)' })
  @ApiResponse({
    status: 404,
    description: 'Track is not favorite',
  })
  removeTrack(@Param('id') id: string) {
    return this.favsService.removeTrack(id);
  }

  @Post('artist/:id')
  @ApiOperation({
    summary: 'Add artist to the favorites',
  })
  @ApiResponse({
    status: 201,
    description: 'Artist exists and added to favorites',
  })
  @ApiResponse({ status: 400, description: 'ArtistId is invalid (not uuid)' })
  @ApiResponse({
    status: 422,
    description: 'Artist with id === albumId does not exist',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete artist from favorites',
  })
  @ApiResponse({
    status: 204,
    description: 'Artist was in favorites and now it is deleted',
  })
  @ApiResponse({ status: 400, description: 'ArtistId is invalid (not uuid)' })
  @ApiResponse({
    status: 404,
    description: 'Artist is not favorite',
  })
  removeArtist(@Param('id') id: string) {
    return this.favsService.removeArtist(id);
  }

  @Post('album/:id')
  @ApiOperation({
    summary: 'Add album to the favorites',
  })
  @ApiResponse({
    status: 201,
    description: 'Album exists and added to favorites',
  })
  @ApiResponse({ status: 400, description: 'AlbumId is invalid (not uuid)' })
  @ApiResponse({
    status: 422,
    description: 'Album with id === albumId does not exist',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete album from favorites',
  })
  @ApiResponse({
    status: 204,
    description: 'Album was in favorites and now it is deleted',
  })
  @ApiResponse({ status: 400, description: 'AlbumId is invalid (not uuid)' })
  @ApiResponse({
    status: 404,
    description: 'Album is not favorite',
  })
  removeAlbum(@Param('id') id: string) {
    return this.favsService.removeAlbum(id);
  }
}
