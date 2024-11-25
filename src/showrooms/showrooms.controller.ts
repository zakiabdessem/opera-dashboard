import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ShowroomService } from './showrooms.service';
import { ShowroomCreateDto } from './dtos/showrooms-create.dto';
import { Response } from 'express';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Showroom } from './showrooms.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as _ from 'lodash';

@Controller('showroom')
export class ShowroomController {
  constructor(
    @InjectModel(Showroom.name) private showroomModel: Model<Showroom>,
    private readonly showRoomService: ShowroomService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('all')
  async findAll(@Res() res: Response) {
    try {
      const showrooms = await this.showRoomService.findAll();
      return res.status(HttpStatus.OK).json({ data: showrooms });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Post('create')
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createShowRoomDto: ShowroomCreateDto,
    @Res() res: Response,
  ) {
    try {
      const newShowroom = new this.showroomModel(createShowRoomDto);

      if (createShowRoomDto.showroom_img) {
        let uploadResult = await this.cloudinaryService.uploadImage(
          'showroom',
          createShowRoomDto.showroom_img,
        );
        if ('url' in uploadResult) {
          newShowroom.showroom_img = uploadResult.url;
        } else {
          throw new Error('product_img upload failed');
        }
      }

      await newShowroom.save();

      return res.status(HttpStatus.OK).json({ data: newShowroom });
    } catch (error) {
      console.error('Error:', error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Get('count')
  async countDocument() {
    return await this.showRoomService.countDocument();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const showroom = await this.showRoomService.findOne(id);
      return res.status(HttpStatus.OK).json({ data: showroom });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Post('delete')
  @Roles(UserRole.ADMIN)
  async delete(@Body() { id }: { id: string }, @Res() res: Response) {
    try {
      await this.showRoomService.delete(id);

      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
