import { Query, Resolver, Args } from '@nestjs/graphql';
import { Product } from './product.schema';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private productService: ProductService,
  ) {}

  @Query(() => Product)
  async product(@Args('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Query(() => [Product])
  async products(
  ): Promise<Product[]> {
    return this.productService.findAll();
  }
  
  @Query(() => [Product])
  async newerProducts(): Promise<Product[]> {
    return this.productService.findNewer();
  }

}
