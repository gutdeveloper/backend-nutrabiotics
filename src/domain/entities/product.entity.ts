import { generateId } from "../utils/id-generator";

interface ProductProps {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  reference: string;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly price: number;
  public readonly quantity: number;
  public readonly reference: string;
  public readonly slug: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  // Constantes para las reglas de dominio
  private static readonly MAX_DESCRIPTION_LENGTH = 600;

  constructor(props: ProductProps) {
    this.id = props.id || '';
    this.name = props.name;

    if (!this.isValidDescription(props.description)) {
      throw new Error(
        `Description must not exceed ${Product.MAX_DESCRIPTION_LENGTH} characters`
      );
    }
    this.description = props.description;

    if (!this.isValidPrice(props.price)) {
      throw new Error("Price must be greater than or equal to zero");
    }
    this.price = props.price;

    if (!this.isValidQuantity(props.quantity)) {
      throw new Error("Quantity must be greater than or equal to zero");
    }
    this.quantity = props.quantity;

    this.reference = props.reference;
    this.slug = props.slug || this.createSlug(props.name, props.reference);
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  private isValidDescription(description: string): boolean {
    return description.length <= Product.MAX_DESCRIPTION_LENGTH;
  }

  private isValidPrice(price: number): boolean {
    return price >= 0;
  }

  private isValidQuantity(quantity: number): boolean {
    return quantity >= 0 && Number.isInteger(quantity);
  }

  private createSlug(name: string, reference: string): string {
    return `${name.toLowerCase().replace(/\s+/g, "-")}-${reference
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  }
}
