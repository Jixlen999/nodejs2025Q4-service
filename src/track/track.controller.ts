import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  ValidationPipe,
  UsePipes,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('track')
@UseGuards(JwtGuard)
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new track',
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
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tracks',
  })
  @ApiResponse({ status: 200, description: 'Returns all tracks records' })
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single track by Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns record with id === trackId if it exists',
  })
  @ApiResponse({ status: 400, description: 'TrackId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update track info',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns updated record if request is valid',
  })
  @ApiResponse({ status: 400, description: 'TrackId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete track',
  })
  @ApiResponse({
    status: 204,
    description: 'Record is found and deleted',
  })
  @ApiResponse({ status: 400, description: 'TrackId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.trackService.remove(id);
  }
}
