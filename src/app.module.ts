import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AnounceModule } from './anounce/anounce.module';
import { BlogModule } from './blogs/blog.module';
import { CatalogueController } from './catalogue/catalogue.controller';
import { ShowroomModule } from './showrooms/showrooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    forwardRef(() =>
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: process.env.NODE_ENV !== 'production',
        context: ({ req }) => ({ req }),
      }),
    ),
    UserModule,
    ProductModule,
    BlogModule,
    CloudinaryModule,
    AnounceModule,
    ShowroomModule,
  ],
  controllers: [CatalogueController],
  providers: [],
})
export class AppModule {}
