import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType('Product')
@Schema({
  timestamps: {
    createdAt: true,
  },
})
export class Product {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  title: string;

  @Field({ nullable: true })
  @Prop()
  product_img: string;

  @Field({ nullable: true })
  @Prop()
  product_pdf: string;

  @Field({ nullable: true })
  @Prop()
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
