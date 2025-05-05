import { OrderProduct } from "../entities/order-product.entity";

export interface OrderProductRepository {
  create(orderProduct: OrderProduct): Promise<OrderProduct>;
  findByOrderId(orderId: string): Promise<OrderProduct[]>;
  deleteByOrderId(orderId: string): Promise<void>;
} 