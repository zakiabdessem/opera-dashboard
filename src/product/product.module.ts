import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { ProductResolver } from './product.resolver';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  providers: [ProductService, ProductResolver],
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CloudinaryModule,
  ],
  exports: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        'product/all',
        'product/single/:id',
        'product/count',
        'product/enduits',
        'product/decors',
        'product/batiments',
      )
      .forRoutes(ProductController);
  }
}
