import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ShowroomCreateDto {
  _id: string;
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  showroom_img: string;

  @IsOptional()
  showroom_pdf: string;
}
