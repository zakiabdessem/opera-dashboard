import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { AnnounceCreateDto, AnnounceEditDto } from './dtos/announce-create.dto';
import { Anounce } from './anounce.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AnounceService {
  constructor(
    @InjectModel(Anounce.name) private anounceModel: Model<Anounce>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(CategoryCreateDto: AnnounceCreateDto): Promise<Anounce> {
    const newProduct = new this.anounceModel(CategoryCreateDto);
    return await newProduct.save();
  }

  // async edit(
  //   anounceEditDto: AnnounceEditDto,
  // ): Promise<Anounce & { _id: string }> {
  //   const announe = await this.anounceModel.findById(anounceEditDto._id);
  //   if (!announe) return null as any;

  //   if (announe.announce_img !== anounceEditDto.announce_img) {
  //     let uploadResult = await this.cloudinaryService.uploadImage(
  //       'announce',
  //       anounceEditDto.announce_img,
  //     );
  //     if ('url' in uploadResult) {
  //       anounceEditDto.announce_img = uploadResult.url;
  //       return await (
  //         this.anounceModel.findByIdAndUpdate(
  //           {
  //             _id: anounceEditDto._id,
  //           },
  //           anounceEditDto,
  //           { new: true },
  //         ) as any
  //       ).exec();
  //     } else {
  //       throw new Error('Image upload failed');
  //     }
  //   }

  //   return await this.anounceModel.findByIdAndUpdate(
  //     anounceEditDto._id,
  //     anounceEditDto,
  //     { new: true },
  //   );
  // }

  async findAll(): Promise<Anounce[]> {
    return await this.anounceModel
      .find()
      .select('announce_img title detail createdAt')
      .populate('product')
      .exec();
  }

  async findOne(id: string | Types.ObjectId): Promise<Anounce> {
    return await this.anounceModel.findById(id);
  }

  async delete(id: string) {
    return await this.anounceModel.findByIdAndDelete(id);
  }

  async countDocument() {
    return this.anounceModel.estimatedDocumentCount() || 0;
  }
}
