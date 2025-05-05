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
      const orderRepo = tx.getOrderRepository();
      const productRepo = tx.getProductRepository();
      const orderProductRepo = tx.getOrderProductRepository();

      // Crear la orden inicialmente sin productos
      const order = new Order({
        userId: orderData.userId,
      });

      let orderWithProducts = order;

      // Buscar cada producto y añadirlo a la orden
      for (const item of orderData.products) {
        const product = await productRepo.findById(item.productId);
        if (!product) {
          throw new NotFoundError(`Product with id ${item.productId} not found`);
        }

        // Verificar que hay stock suficiente
        if (product.quantity < item.quantity) {
          throw new BadRequestError(`Not enough stock for product ${product.name}`);
        }

        // Crear el OrderProduct con los datos del producto en el momento de la compra
        const orderProduct = new OrderProduct({
          orderId: order.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });

        // Añadir el producto a la orden (esto crea una nueva instancia de Order)
        orderWithProducts = orderWithProducts.addProduct(orderProduct);
      }

      // Guardar la orden
      const createdOrder = await orderRepo.create(orderWithProducts);

      // Guardar los productos de la orden
      for (const product of orderWithProducts.products) {
        await orderProductRepo.create(product);

        // Actualizar el stock del producto
        const originalProduct = await productRepo.findById(product.productId);
        if (originalProduct) {
          await productRepo.update(product.productId, {
            quantity: originalProduct.quantity - product.quantity,
          });
        }
      }

      // Obtener la orden completa con sus productos
      const orderWithDetails = await orderRepo.findById(createdOrder.id);
      return orderWithDetails || createdOrder;
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