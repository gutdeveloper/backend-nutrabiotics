import { Order } from "../entities/order.entity";
import {
  PaginationParamsDto,
  PaginatedResponseDto,
} from "../../application/dtos/common/pagination.interface";

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findAll(pagination: PaginationParamsDto): Promise<PaginatedResponseDto<Order>>;
  findAllByUserId(userId: string, pagination: PaginationParamsDto): Promise<PaginatedResponseDto<Order>>;
  findById(id: string): Promise<Order | null>;
  update(id: string, order: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<void>;
} 