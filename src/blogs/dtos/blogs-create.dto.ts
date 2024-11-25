import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BlogCreateDto {
  _id: string;
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  blog_img: string;

  @IsOptional()
  blog_pdf: string;
}
