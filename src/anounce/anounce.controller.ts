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
import { Response } from 'express';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as _ from 'lodash';
import { Anounce } from './anounce.schema';
import { AnnounceCreateDto } from './dtos/announce-create.dto';
import { AnounceService } from './anounce.service';

@Controller('announce')
export class AnnounceController {
  constructor(
    @InjectModel(Anounce.name) private anounceModel: Model<Anounce>,
    private readonly anounceService: AnounceService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('all')
  async find(@Res() res: Response) {
    try {
      const anounces = await this.anounceService.findAll();
      return res.status(HttpStatus.OK).json({ data: anounces });
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
    @Body() createAnounceDto: AnnounceCreateDto,
    @Res() res: Response,
  ) {
    try {
      const newAnnounce = new this.anounceModel(createAnounceDto);

      // if (createAnounceDto.announce_img) {
      //   const uploadResult = await this.cloudinaryService.uploadImage(
      //     'announce',
      //     createAnounceDto.announce_img,
      //   );
      //   if ('url' in uploadResult) {
      //     newAnnounce.announce_img = uploadResult.url;
      //   } else {
      //     throw new Error('Image upload failed');
      //   }
      // }

      await newAnnounce.save();

      return res.status(HttpStatus.OK).json({ data: newAnnounce });
    } catch (error) {
      console.error('Error:', error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  // @Post('edit')
  // @Roles(UserRole.ADMIN)
  // async edit(@Body() editAnounceDto: AnnounceCreateDto, @Res() res: Response) {
  //   try {
  //     const anounce = await this.anounceService.edit(editAnounceDto);

  //     return res.status(HttpStatus.OK).json({ data: anounce });
  //   } catch (error) {
  //     console.error(error);

  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: 'Internal server error',
  //     });
  //   }
  // }

  @Get('count')
  async countDocument() {
    return await this.anounceService.countDocument();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const anounce = await this.anounceService.findOne(id);
      return res.status(HttpStatus.OK).json({ data: anounce });
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
      await this.anounceService.delete(id);

      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
