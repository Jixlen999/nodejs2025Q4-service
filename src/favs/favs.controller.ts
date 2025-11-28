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

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('track/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    return this.favsService.removeTrack(id);
  }

  @Post('artist/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    return this.favsService.removeArtist(id);
  }

  @Post('album/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    return this.favsService.removeAlbum(id);
  }
}
