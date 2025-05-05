import { PrismaClient, Prisma } from "@prisma/client";
import { Order } from "../../domain/entities/order.entity";
import { OrderRepository } from "../../domain/interfaces/order-repository.interface";
import { OrderProduct } from "../../domain/entities/order-product.entity";
import { User, UserRole } from "../../domain/entities/user.entity";
import {
  PaginationParamsDto,
  PaginatedResponseDto,
} from "../../application/dtos/common/pagination.interface";

export class PrismaOrderRepository implements OrderRepository {

  constructor(private readonly prisma: PrismaClient) {}

  async create(order: Order): Promise<Order> {
    const { userId, total, quantity_products } = order;
    
    const createdOrder = await this.prisma.order.create({ data: {
      userId,
      total,
      quantity_products,
    } as any });

    console.log('createdOrder', createdOrder);

    return new Order({
      ...createdOrder,
      products: [],
    });
  }

  async findAll(
    pagination: PaginationParamsDto
  ): Promise<PaginatedResponseDto<Order>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [ordersData, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          products: true,
          user: true,
        },
      }),
      this.prisma.order.count(),
    ]);

    // Mapear los datos a entidades de dominio
    const orders = await Promise.all(
      ordersData.map(async (data: any) => {
        const products = data.products.map(
          (product: any) =>
            new OrderProduct({
              ...product,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
            })
        );

        const user = data.user ? new User({
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          password: data.user.password, // No exponemos la contraseña
          role: data.user.role as UserRole,
        }) : null;

        return new Order({
          ...data,
          products,
          user,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      })
    );

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllByUserId(
    userId: string,
    pagination: PaginationParamsDto
  ): Promise<PaginatedResponseDto<Order>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [ordersData, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          userId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          products: true,
        },
      }),
      this.prisma.order.count({
        where: {
          userId,
        },
      }),
    ]);

    // Mapear los datos a entidades de dominio
    const orders = await Promise.all(
      ordersData.map(async (data: any) => {
        const products = data.products.map(
          (product: any) =>
            new OrderProduct({
              ...product,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
            })
        );

        return new Order({
          ...data,
          products,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      })
    );

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!order) return null;

    const products = order.products.map(
      (product: any) =>
        new OrderProduct({
          ...product,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })
    );

    return new Order({
      ...order,
      products,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }
} 