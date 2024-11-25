import { IsNotEmpty, IsString } from 'class-validator';

export class ProductCreateDto {
  _id: string;
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  product_img: string;

  @IsString()
  @IsNotEmpty()
  product_pdf: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}
