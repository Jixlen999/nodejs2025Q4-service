import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new artist',
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
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all artists',
  })
  @ApiResponse({ status: 200, description: 'Returns all artists records' })
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single artist by Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns record with id === artistId if it exists',
  })
  @ApiResponse({ status: 400, description: 'ArtistId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update artist info',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns updated record if request is valid',
  })
  @ApiResponse({ status: 400, description: 'ArtistId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete artist',
  })
  @ApiResponse({
    status: 204,
    description: 'Record is found and deleted',
  })
  @ApiResponse({ status: 400, description: 'ArtistId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.artistService.remove(id);
  }
}
