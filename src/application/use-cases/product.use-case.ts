import { ProductRepository } from "../../domain/interfaces/product-repository.interface";
import { CreateProductDto } from "../dtos/product/create-product.dto";
import { UpdateProductDto } from "../dtos/product/update-product.dto";
import { Product } from "../../domain/entities/product.entity";
import {
  PaginatedResponseDto,
  PaginationParamsDto,
} from "../dtos/common/pagination.interface";
import { ConflictError } from "../../domain/errors/conflict.error";
import { NotFoundError } from "../../domain/errors/not-found.error";

export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(productData: CreateProductDto): Promise<Product> {
    const product = new Product({
      ...productData,
    });

    const existingProduct = await this.productRepository.findBySlug(
      product.slug
    );

    if (existingProduct) {
      throw new ConflictError("Product already exists");
    }

    return await this.productRepository.create(product);
  }

  async findAll(
    pagination: PaginationParamsDto
  ): Promise<PaginatedResponseDto<Product>> {
    return await this.productRepository.findAll(pagination);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.productRepository.findBySlug(slug);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  async update(id: string, productData: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }

    // Si hay cambios en el nombre o la referencia, calcular el nuevo slug
    let updateData: any = { ...productData };
    if (productData.name || productData.reference) {
      const newName = productData.name || existingProduct.name;
      const newReference = productData.reference || existingProduct.reference;
      const product = new Product({
        name: newName,
        description: "",
        price: 0,
        quantity: 0,
        reference: newReference,
      });
      updateData.slug = product.slug;
    }

    updateData.updatedAt = new Date();

    return await this.productRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }

    await this.productRepository.delete(id);
  }
}
