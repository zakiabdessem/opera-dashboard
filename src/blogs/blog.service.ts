import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './blog.schema';
import { Model, Types } from 'mongoose';
import { BlogCreateDto } from './dtos/blogs-create.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(BlogCreateDto: BlogCreateDto): Promise<Blog> {
    const newProduct = new this.blogModel(BlogCreateDto);
    return await newProduct.save();
  }

  async edit(BlogCreateDto: BlogCreateDto): Promise<Blog & { _id: string }> {
    const blog = await this.blogModel.findById(BlogCreateDto._id);

    if (!blog) return null as any;

    if (blog.blog_img !== BlogCreateDto.blog_img) {
      let uploadResult = await this.cloudinaryService.uploadImage(
        'blog',
        BlogCreateDto.blog_img,
      );

      if ('url' in uploadResult) BlogCreateDto.blog_img = uploadResult.url;
      else throw new Error('BlogCreateDto Image upload failed');
    }

    if (blog.blog_pdf !== BlogCreateDto.blog_pdf) {
      let uploadResult = await this.cloudinaryService.uploadPdf(
        'blog',
        BlogCreateDto.blog_pdf,
      );

      if ('url' in uploadResult) BlogCreateDto.blog_pdf = uploadResult.url;
      else throw new Error('BlogCreateDto Image upload failed');
    }

    await blog.updateOne(BlogCreateDto);

    return BlogCreateDto;
  }

  async findAll(): Promise<Blog[]> {
    return await this.blogModel.find().exec();
  }

  async findRelevant() {
    return await this.blogModel
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
    return await this.blogModel
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

  async findOne(id: string | Types.ObjectId): Promise<Blog> {
    return await this.blogModel.findById(id);
  }

  async delete(id: string) {
    return await this.blogModel.findByIdAndDelete(id);
  }

  async countDocument() {
    return this.blogModel.estimatedDocumentCount() || 0;
  }
}
