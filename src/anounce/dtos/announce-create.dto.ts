import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnnounceCreateDto {
  _id: string;
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  detail: string;

  // @IsString()
  // @IsNotEmpty()
  // announce_img: string;

  @IsOptional()
  @IsString()
  product: string;
}

export class AnnounceEditDto {
  @IsNotEmpty()
  _id: string;
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  detail: string;

  @IsOptional()
  @IsString()
  product: string;

  // @IsString()
  // @IsNotEmpty()
  // announce_img: string;
}
