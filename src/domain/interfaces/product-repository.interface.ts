import { Product } from "../entities/product.entity";
import {
  PaginationParamsDto,
  PaginatedResponseDto,
} from "../../application/dtos/common/pagination.interface";

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findAll(pagination: PaginationParamsDto): Promise<PaginatedResponseDto<Product>>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}
