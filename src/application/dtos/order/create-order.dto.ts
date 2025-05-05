export interface CreateOrderProductDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  userId: string;
  products: CreateOrderProductDto[];
} 