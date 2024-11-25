import { Field, ID, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType('Anounce')
@Schema({
  timestamps: true,
})
export class Anounce {
  @Field(() => ID, { nullable: true })
  _id: mongoose.Schema.Types.ObjectId | string;

  // @Field()
  // @Prop()
  // announce_img: string;

  @Field({ nullable: true })
  @Prop({
    required: true,
  })
  title: string;

  @Field({ nullable: true })
  @Prop()
  detail: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: mongoose.Schema.Types.ObjectId;

  @Field({ nullable: true })
  @Prop({
    required: false,
  })
  createdAt?: Date;
}

export const AnounceSchema = SchemaFactory.createForClass(Anounce);
