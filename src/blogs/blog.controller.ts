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
import { BlogService } from './blog.service';
import { BlogCreateDto } from './dtos/blogs-create.dto';
import { Response } from 'express';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './blog.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as _ from 'lodash';

@Controller('blog')
export class BlogController {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private readonly blogService: BlogService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('all')
  async findAll(@Res() res: Response) {
    try {
      const blogs = await this.blogService.findAll();
      return res.status(HttpStatus.OK).json({ data: blogs });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Post('create')
  @Roles(UserRole.ADMIN)
  async create(@Body() createBlogDto: BlogCreateDto, @Res() res: Response) {
    try {
      const newBlog = new this.blogModel(createBlogDto);

      if (createBlogDto.blog_img) {
        let uploadResult = await this.cloudinaryService.uploadImage(
          'blog',
          createBlogDto.blog_img,
        );
        if ('url' in uploadResult) {
          newBlog.blog_img = uploadResult.url;
        } else {
          throw new Error('product_img upload failed');
        }
      }

      if (createBlogDto.blog_pdf) {
        let uploadResult = await this.cloudinaryService.uploadPdf(
          'blog',
          createBlogDto.blog_pdf,
        );
        if ('url' in uploadResult) {
          newBlog.blog_pdf = uploadResult.url;
        } else {
          throw new Error('product_pdf upload failed');
        }
      }

      await newBlog.save();

      return res.status(HttpStatus.OK).json({ data: newBlog });
    } catch (error) {
      console.error('Error:', error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Post('edit')
  @Roles(UserRole.ADMIN)
  async edit(@Body() editBlogDto: BlogCreateDto, @Res() res: Response) {
    try {
      const blog = await this.blogService.edit(editBlogDto);

      return res.status(HttpStatus.OK).json({ data: blog });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Get('count')
  async countDocument() {
    return await this.blogService.countDocument();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const blog = await this.blogService.findOne(id);
      return res.status(HttpStatus.OK).json({ data: blog });
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
      await this.blogService.delete(id);

      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
