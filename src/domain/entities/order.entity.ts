import { OrderProduct } from "./order-product.entity";
import { User } from "./user.entity";

interface OrderProps {
  id?: string;
  userId: string;
  total?: number;
  quantity_products?: number;
  products?: OrderProduct[];
  user?: User | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  public readonly id: string;
  public readonly userId: string;
  public readonly total: number;
  public readonly quantity_products: number;
  public readonly products: OrderProduct[];
  public readonly user?: User | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: OrderProps) {
    // Si no se proporciona un ID, se establece como vacío y se espera que se asigne después
    this.id = props.id || '';
    this.userId = props.userId;
    this.products = props.products || [];
    this.total = props.total || this.calculateTotal();
    this.quantity_products = props.quantity_products || this.calculateQuantityProducts();
    this.user = props.user || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  private calculateTotal(): number {
    if (!this.products || this.products.length === 0) {
      return 0;
    }
    
    return this.products.reduce((sum, product) => sum + product.subtotal, 0);
  }

  private calculateQuantityProducts(): number {
    if (!this.products || this.products.length === 0) {
      return 0;
    }
    
    return this.products.reduce((sum, product) => sum + product.quantity, 0);
  }

  public addProduct(product: OrderProduct): Order {
    // Crear una nueva instancia de Order para mantener la inmutabilidad
    return new Order({
      id: this.id,
      userId: this.userId,
      products: [...this.products, product],
      user: this.user,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  public toJSON() {
    const userToJSON = {
      id: this.id,      
      products: this.products,
      total: this.total,
      quantity_products: this.quantity_products,      
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...(this.user && { user: this.user }),
    };    
    return userToJSON;
  }
} 