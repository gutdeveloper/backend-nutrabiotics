interface OrderProductProps {
  id?: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class OrderProduct {
  public readonly id: string;
  public readonly orderId: string;
  public readonly productId: string;
  public readonly name: string;
  public readonly price: number;
  public readonly quantity: number;
  public readonly subtotal: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: OrderProductProps) {
    this.id = props.id || '';
    this.orderId = props.orderId;
    this.productId = props.productId;
    this.name = props.name;
    
    if (!this.isValidPrice(props.price)) {
      throw new Error("Price must be greater than or equal to zero");
    }
    this.price = props.price;

    if (!this.isValidQuantity(props.quantity)) {
      throw new Error("Quantity must be greater than or equal to zero");
    }
    this.quantity = props.quantity;
    
    this.subtotal = props.subtotal || this.calculateSubtotal();
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  private isValidPrice(price: number): boolean {
    return price >= 0;
  }

  private isValidQuantity(quantity: number): boolean {
    return quantity >= 0 && Number.isInteger(quantity);
  }

  private calculateSubtotal(): number {
    return this.price * this.quantity;
  }
} 