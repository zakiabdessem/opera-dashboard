import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Anounce, AnounceSchema } from './anounce.schema';
import { AnnounceController } from './anounce.controller';
import { AnounceService } from './anounce.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthMiddleware } from 'middleware/auth.middleware';

@Module({
  providers: [AnounceService],
  controllers: [AnnounceController],
  imports: [
    MongooseModule.forFeature([{ name: Anounce.name, schema: AnounceSchema }]),
    CloudinaryModule,
  ],
  exports: [],
})
export class AnounceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('announce/all', 'announce/single/:id', 'announce/count')
      .forRoutes(AnnounceController);
  }
}
