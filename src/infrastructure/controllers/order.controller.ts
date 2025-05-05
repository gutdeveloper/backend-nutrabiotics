import { NextFunction, Request, Response } from "express";
import { OrderUseCase } from "../../application/use-cases/order.use-case";
import { CreateOrderDto } from "../../application/dtos/order/create-order.dto";

export class OrderController {
  constructor(private readonly orderUseCase: OrderUseCase) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderData: CreateOrderDto = {
        userId: req.body.user.id,
        ...req.body,
      };

      const order = await this.orderUseCase.create(orderData);

      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const orders = await this.orderUseCase.findAll({ page, limit });

      res.status(200).json({
        data: orders.data,
        meta: orders.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAllByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.body.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const orders = await this.orderUseCase.findAllByUserId(userId, {
        page,
        limit,
      });

      res.status(200).json({
        data: orders.data,
        meta: orders.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.user.id;
      const order = await this.orderUseCase.findById(userId, id);

      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}
