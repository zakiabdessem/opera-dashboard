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
import { ProductService } from './product.service';
import { ProductCreateDto } from './dtos/product-create.dto';
import { Response } from 'express';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/decorator/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as _ from 'lodash';

@Controller('product')
export class ProductController {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly prodcutService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('all')
  async findAll(@Res() res: Response) {
    try {
      const products = await this.prodcutService.findAll();
      return res.status(HttpStatus.OK).json({ data: products });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Get('batiments')
  async findBatiments(@Res() res: Response) {
    try {
      const products = await this.prodcutService.findBatiments();
      return res.status(HttpStatus.OK).json({ data: products });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Get('decors')
  async findDecors(@Res() res: Response) {
    try {
      const products = await this.prodcutService.findDecors();
      return res.status(HttpStatus.OK).json({ data: products });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Get('enduits')
  async findEnduits(@Res() res: Response) {
    try {
      const products = await this.prodcutService.findEnduits();
      return res.status(HttpStatus.OK).json({ data: products });
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
    @Body() createProductDto: ProductCreateDto,
    @Res() res: Response,
  ) {
    try {
      const newProduct = new this.productModel(createProductDto);

      if (createProductDto.product_img) {
        let uploadResult = await this.cloudinaryService.uploadImage(
          'product',
          createProductDto.product_img,
        );
        if ('url' in uploadResult) {
          newProduct.product_img = uploadResult.url;
        } else {
          throw new Error('product_img upload failed');
        }
      }

      if (createProductDto.product_pdf) {
        let uploadResult = await this.cloudinaryService.uploadPdf(
          'product',
          createProductDto.product_pdf,
        );
        if ('url' in uploadResult) {
          newProduct.product_pdf = uploadResult.url;
        } else {
          throw new Error('product_pdf upload failed');
        }
      }

      await newProduct.save();

      return res.status(HttpStatus.OK).json({ data: newProduct });
    } catch (error) {
      console.error('Error:', error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Post('edit')
  @Roles(UserRole.ADMIN)
  async edit(@Body() editProductDto: ProductCreateDto, @Res() res: Response) {
    try {
      const product = await this.prodcutService.edit(editProductDto);

      return res.status(HttpStatus.OK).json({ data: product });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }

  @Get('count')
  async countDocument() {
    return await this.prodcutService.countDocument();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const product = await this.prodcutService.findOne(id);
      return res.status(HttpStatus.OK).json({ data: product });
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
      await this.prodcutService.delete(id);

      return res.status(HttpStatus.OK).json({ message: 'Success' });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
