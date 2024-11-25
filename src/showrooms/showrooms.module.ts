import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ShowroomService } from './showrooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ShowroomController } from './showrooms.controller';
import { Showroom, ShowroomSchema } from './showrooms.schema';

@Module({
  providers: [ShowroomService],
  controllers: [ShowroomController],
  imports: [
    MongooseModule.forFeature([
      { name: Showroom.name, schema: ShowroomSchema },
    ]),
    CloudinaryModule,
  ],
  exports: [ShowroomService],
})
export class ShowroomModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('showrooms/all', 'showrooms/single/:id', 'showrooms/count')
      .forRoutes(ShowroomService);
  }
}
