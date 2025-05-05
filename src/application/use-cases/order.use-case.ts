import { OrderRepository } from "../../domain/interfaces/order-repository.interface";
import { UserRepository } from "../../domain/interfaces/user-repository.interface";
import { Transaction } from "../../domain/interfaces/transaction.interface";
import { Order } from "../../domain/entities/order.entity";
import { OrderProduct } from "../../domain/entities/order-product.entity";
import { CreateOrderDto } from "../dtos/order/create-order.dto";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { BadRequestError } from "../../domain/errors/bad-request.error";
import {
  PaginatedResponseDto,
  PaginationParamsDto,
} from "../dtos/common/pagination.interface";
import { ForbiddenError } from "../../domain/errors/forbidden.error";
import { UserRole } from "../../domain/entities/user.entity";
import { ProductRepository } from "../../domain/interfaces/product-repository.interface";
import { OrderProductRepository } from "../../domain/interfaces/order-product-repository.interface";

export class OrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly transaction: Transaction
  ) {}

  async create(orderData: CreateOrderDto): Promise<Order> {
    // Validar que la orden tenga al menos un producto
    if (!orderData.products || orderData.products.length === 0) {
      throw new BadRequestError("Order must have at least one product");
    }

    // Ejecutar toda la operación dentro de una transacción
    return this.transaction.run(async (tx) => {
      // Obtener los repositorios para la transacción actual
      const orderRepo: OrderRepository = tx.getOrderRepository();
      const productRepo: ProductRepository = tx.getProductRepository();
      const orderProductRepo: OrderProductRepository = tx.getOrderProductRepository();

      // Recopilar información de los productos
      const orderItems = [];
      let totalQuantityProducts = 0;
      let totalAmount = 0;

      // Buscar cada producto y calcular totales
      for (const item of orderData.products) {
        const product = await productRepo.findById(item.productId);
        if (!product) {
          throw new NotFoundError(`Product with id ${item.productId} not found`);
        }

        // Verificar que hay stock suficiente
        if (product.quantity < item.quantity) {
          throw new BadRequestError(`Not enough stock for product ${product.name}`);
        }

        // Guardar los datos del producto para utilizarlos después
        orderItems.push({
          product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity
        });

        totalQuantityProducts += item.quantity;
        totalAmount += product.price * item.quantity;
      }

      // Crear la orden con los totales calculados
      const order = new Order({
        userId: orderData.userId,
        total: totalAmount,
        quantity_products: totalQuantityProducts
      });

      // Guardar la orden en la base de datos (esto asignará un ID)
      const createdOrder = await orderRepo.create(order);

      // Ahora que tenemos el ID de la orden, crear los productos asociados
      for (const item of orderItems) {
        const orderProduct = new OrderProduct({
          orderId: createdOrder.id, // Usar el ID generado por Prisma
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.subtotal
        });

        // Guardar el producto de la orden
        await orderProductRepo.create(orderProduct);

        // Actualizar el stock del producto
        await productRepo.update(item.product.id, {
          quantity: item.product.quantity - item.quantity,
        });
      }

      // Obtener la orden completa con sus productos
      const orderWithDetails = await orderRepo.findById(createdOrder.id);
      if (!orderWithDetails) {
        throw new NotFoundError("Order not found");
      }

      return orderWithDetails;
    });
  }

  async findAll(
    pagination: PaginationParamsDto
  ): Promise<PaginatedResponseDto<Order>> {
    return await this.orderRepository.findAll(pagination);
  }

  async findAllByUserId(
    userId: string,
    pagination: PaginationParamsDto
  ): Promise<PaginatedResponseDto<Order>> {
    return await this.orderRepository.findAllByUserId(userId, pagination);
  }

  async findById(userId: string, id: string): Promise<Order> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.getRole() !== UserRole.ADMIN) {
      throw new ForbiddenError("User is not authorized to access this resource");
    }

    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return order;
  }
} 