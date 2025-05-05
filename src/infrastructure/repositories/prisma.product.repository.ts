import { PrismaClient } from "@prisma/client";
import { Product } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/interfaces/product-repository.interface";
import {
  PaginationParamsDto,
  PaginatedResponseDto,
} from "../../application/dtos/common/pagination.interface";

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<Product> {
    const { name, description, price, quantity, reference, slug } = product;

    const createdProduct = await this.prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        reference,
        slug,
      },
    });

    return new Product(createdProduct);
  }

  async findAll(
    pagination: PaginationParamsDto
  ): Promise<PaginatedResponseDto<Product>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [productsData, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.product.count(),
    ]);

    // Mapear los datos a entidades de dominio
    const products = productsData.map(
      (data: any) =>
        new Product({
          ...data,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
    );

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    return new Product({
      ...product,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (!product) return null;

    return new Product({
      ...product,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: productData,
    });

    return new Product({
      ...updatedProduct,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }
}
