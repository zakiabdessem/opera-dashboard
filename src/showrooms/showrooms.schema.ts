import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType('Showroom')
@Schema({
  timestamps: {
    createdAt: true,
  },
})
export class Showroom {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Field({ nullable: true })
  @Prop()
  title: string;

  @Field({ nullable: true })
  @Prop()
  showroom_img: string;
}

export const ShowroomSchema = SchemaFactory.createForClass(Showroom);
