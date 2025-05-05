import { generateId } from "../utils/id-generator";
import { OrderProduct } from "./order-product.entity";

interface OrderProps {
  id?: string;
  userId: string;
  total?: number;
  products?: OrderProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  public readonly id: string;
  public readonly userId: string;
  public readonly total: number;
  public readonly products: OrderProduct[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: OrderProps) {
    this.id = props.id || generateId();
    this.userId = props.userId;
    this.products = props.products || [];
    this.total = props.total || this.calculateTotal();
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  private calculateTotal(): number {
    if (!this.products || this.products.length === 0) {
      return 0;
    }
    
    return this.products.reduce((sum, product) => sum + product.subtotal, 0);
  }

  public addProduct(product: OrderProduct): Order {
    // Crear una nueva instancia de Order para mantener la inmutabilidad
    return new Order({
      id: this.id,
      userId: this.userId,
      products: [...this.products, product],
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }
} 