import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('album')
@UseGuards(JwtGuard)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new album',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns newly created record if request is valid',
  })
  @ApiResponse({
    status: 400,
    description: 'Request body does not contain required field',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all albums',
  })
  @ApiResponse({ status: 200, description: 'Returns all albums records' })
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single album by Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns record with id === albumId if it exists',
  })
  @ApiResponse({ status: 400, description: 'AlbumId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update album info',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns updated record if request is valid',
  })
  @ApiResponse({ status: 400, description: 'AlbumId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete album',
  })
  @ApiResponse({
    status: 204,
    description: 'Record is found and deleted',
  })
  @ApiResponse({ status: 400, description: 'AlbumId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.albumService.remove(id);
  }
}
