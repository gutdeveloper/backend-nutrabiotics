import { NextFunction, Request, Response } from 'express';
import { ProductUseCase } from '../../application/use-cases/product.use-case';
import { CreateProductDto } from '../../application/dtos/product/create-product.dto';
import { UpdateProductDto } from '../../application/dtos/product/update-product.dto';
import { PaginationParamsDto } from '../../application/dtos/common/pagination.interface';

export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, price, quantity, reference } = req.body;
      const productData: CreateProductDto = {
        name, 
        description, 
        price,
        quantity, 
        reference
      };
      
      const product = await this.productUseCase.create(productData);
      res.status(201).json(product);
    } catch (error: any) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      
      const pagination: PaginationParamsDto = { page, limit };
      const products = await this.productUseCase.findAll(pagination);
      
      res.status(200).json(products);
    } catch (error: any) {
      next(error);
    }
  }

  async findBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const product = await this.productUseCase.findBySlug(slug);
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      res.status(200).json(product);
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, price, quantity, reference } = req.body;
      
      const productData: UpdateProductDto = {};
      
      if (name !== undefined) productData.name = name;
      if (description !== undefined) productData.description = description;
      if (price !== undefined) productData.price = price;
      if (quantity !== undefined) productData.quantity = quantity;
      if (reference !== undefined) productData.reference = reference;
      
      const product = await this.productUseCase.update(id, productData);
      res.status(200).json(product);
    } catch (error: any) {
      if (error.message === 'Product not found') {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.productUseCase.delete(id);
      res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Product not found') {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      next(error);
    }
  }
} 