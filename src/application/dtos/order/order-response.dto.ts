export interface OrderProductResponseDto {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponseDto {
  id: string;
  userId: string;
  total: number;
  products: OrderProductResponseDto[];
  createdAt: Date;
  updatedAt: Date;
} 