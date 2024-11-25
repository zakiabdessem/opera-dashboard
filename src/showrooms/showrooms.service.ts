import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Showroom } from './showrooms.schema';
import { Model, Types } from 'mongoose';
import { ShowroomCreateDto } from './dtos/showrooms-create.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ShowroomService {
  constructor(
    @InjectModel(Showroom.name) private showroomModel: Model<Showroom>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(ShowroomCreateDto: ShowroomCreateDto): Promise<Showroom> {
    const newProduct = new this.showroomModel(ShowroomCreateDto);
    return await newProduct.save();
  }

  async findAll(): Promise<Showroom[]> {
    return await this.showroomModel.find().exec();
  }

  async findOne(id: string | Types.ObjectId): Promise<Showroom> {
    return await this.showroomModel.findById(id);
  }

  async delete(id: string) {
    return await this.showroomModel.findByIdAndDelete(id);
  }

  async countDocument() {
    return this.showroomModel.estimatedDocumentCount() || 0;
  }
}
