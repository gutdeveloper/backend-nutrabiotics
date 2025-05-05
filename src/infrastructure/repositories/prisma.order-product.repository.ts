import { PrismaClient } from "@prisma/client";
import { OrderProduct } from "../../domain/entities/order-product.entity";
import { OrderProductRepository } from "../../domain/interfaces/order-product-repository.interface";

export class PrismaOrderProductRepository implements OrderProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(orderProduct: OrderProduct): Promise<OrderProduct> {
    const { orderId, productId, name, price, quantity, subtotal } = orderProduct;

    const createdOrderProduct = await this.prisma.orderProduct.create({
      data: {
        orderId,
        productId,
        name,
        price,
        quantity,
        subtotal,
      },
    });

    return new OrderProduct({
      ...createdOrderProduct,
      createdAt: createdOrderProduct.createdAt,
      updatedAt: createdOrderProduct.updatedAt,
    });
  }

  async findByOrderId(orderId: string): Promise<OrderProduct[]> {
    const orderProducts = await this.prisma.orderProduct.findMany({
      where: { orderId },
    });

    return orderProducts.map(
      (product) =>
        new OrderProduct({
          ...product,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })
    );
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    await this.prisma.orderProduct.deleteMany({
      where: { orderId },
    });
  }
} 