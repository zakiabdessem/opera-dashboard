import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  providers: [BlogService],
  controllers: [BlogController],
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    CloudinaryModule,
  ],
  exports: [BlogService],
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('blog/all', 'blog/single/:id', 'blog/count')
      .forRoutes(BlogController);
  }
}
