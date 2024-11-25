import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType('Blog')
@Schema({
  timestamps: {
    createdAt: true,
  },
})
export class Blog {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Field({ nullable: true })
  @Prop()
  title: string;

  @Field({ nullable: true })
  @Prop()
  blog_img: string;

  @Field({ nullable: true })
  @Prop()
  blog_pdf: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
