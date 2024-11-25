import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model, Types } from 'mongoose';
import { ProductCreateDto } from './dtos/product-create.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(ProductCreateDto: ProductCreateDto): Promise<Product> {
    const newProduct = new this.productModel(ProductCreateDto);
    return await newProduct.save();
  }

  async edit(
    ProductEditDto: ProductCreateDto,
  ): Promise<Product & { _id: string }> {
    const product = await this.productModel.findById(ProductEditDto._id);

    if (!product) return null as any;

    if (product.product_img !== ProductEditDto.product_img) {
      let uploadResult = await this.cloudinaryService.uploadImage(
        'product',
        ProductEditDto.product_img,
      );

      if ('url' in uploadResult) ProductEditDto.product_img = uploadResult.url;
      else throw new Error('ProductEditDto Image upload failed');
    }

    if (product.product_pdf !== ProductEditDto.product_pdf) {
      let uploadResult = await this.cloudinaryService.uploadPdf(
        'product',
        ProductEditDto.product_pdf,
      );

      if ('url' in uploadResult) ProductEditDto.product_pdf = uploadResult.url;
      else throw new Error('ProductEditDto Image upload failed');
    }

    await product.updateOne(ProductEditDto);

    return ProductEditDto;
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async findBatiments(): Promise<Product[]> {
    return await this.productModel
      .find({
        category: 'batiments',
      })
      .exec();
  }

  async findDecors(): Promise<Product[]> {
    return await this.productModel
      .find({
        category: 'decors',
      })
      .exec();
  }

  async findEnduits(): Promise<Product[]> {
    return await this.productModel
      .find({
        category: 'enduits',
      })
      .exec();
  }

  async findRelevant() {
    return await this.productModel
      .find({
        $or: [
          { track: true, quantity: { $gt: 0 }, promote: false },
          { track: false, inStock: true, promote: false },
        ],
      })
      .limit(8)
      .sort({
        createdAt: 1,
      })
      .exec();
  }

  async findNewer() {
    return await this.productModel
      .find({
        $or: [
          { track: true, quantity: { $gt: 0 }, promote: true },
          { track: false, inStock: true, promote: true },
        ],
      })
      .limit(4)
      .sort({
        createdAt: 1,
      })
      .exec();
  }

  async findOne(id: string | Types.ObjectId): Promise<Product> {
    return await this.productModel.findById(id);
  }

  async delete(id: string) {
    return await this.productModel.findByIdAndDelete(id);
  }

  async countDocument() {
    return this.productModel.estimatedDocumentCount() || 0;
  }
}
