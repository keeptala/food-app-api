import { Products, PrismaClient } from '@prisma/client';

export interface IProductsRepository {
  fetchProducts(): Promise<Array<Products>>;
  fetchProduct(id: number): Promise<Products>;
  createProduct(product: Products): Promise<Products>;
  updateProduct(product: Products): Promise<Products>;
  deleteProduct(id: string): Promise<Products>;
}

const prisma = new PrismaClient();

export default class ProductsRepository implements IProductsRepository {
  async fetchProducts(): Promise<Products[]> {
    const products = await prisma.products.findMany();
    return products;
  }
  async fetchProduct(id: number): Promise<Products> {
    const product = await prisma.products.findFirst({
      where: {
        id: {
          equals: parseInt(id.toString()),
        },
      },
    });
    return product;
  }
  async createProduct(product: Products): Promise<Products> {
    const res = await prisma.products.create({
      data: {...product,price:parseInt(product.price.toString())},
    });
    return res;
  }
  async updateProduct(product: Products): Promise<Products> {
    const res = await prisma.products.update({
      data: product,
      where: {
        id: parseInt(product.id.toString()),
      },
    });
    return res;
  }
  async deleteProduct(id: string): Promise<Products> {
    const res = await prisma.products.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res;
  }
}
