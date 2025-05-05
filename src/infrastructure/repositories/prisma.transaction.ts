import { PrismaClient } from "@prisma/client";
import { Transaction, TransactionContext } from "../../domain/interfaces/transaction.interface";
import { PrismaOrderRepository } from "./prisma.order.repository";
import { PrismaProductRepository } from "./prisma.product.repository";
import { PrismaOrderProductRepository } from "./prisma.order-product.repository";

export class PrismaTransaction implements Transaction {
  constructor(private readonly prisma: PrismaClient) {}

  async run<T>(operation: (tx: TransactionContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (prismaTransaction) => {
      // Crear un contexto que contenga los métodos para acceder a los repositorios
      const context: TransactionContext = {
        getOrderRepository: () => this.getRepository(PrismaOrderRepository, prismaTransaction),
        getProductRepository: () => this.getRepository(PrismaProductRepository, prismaTransaction),
        getOrderProductRepository: () => this.getRepository(PrismaOrderProductRepository, prismaTransaction),        
        getRepository: <R>(repositoryClass: new (...args: any[]) => R) => 
          this.getRepository(repositoryClass, prismaTransaction),
      };

      return operation(context);
    });
  }

  getRepository<R>(
    RepositoryClass: new (...args: any[]) => R, 
    ...args: any[]
  ): R {
    // Crear una nueva instancia del repositorio con la transacción actual
    return new RepositoryClass(...args);
  }
} 