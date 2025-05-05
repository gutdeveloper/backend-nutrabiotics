import { z } from "zod";

// Esquema para los productos dentro de una orden
const orderProductSchema = z.object({
  productId: z.string().uuid("Product ID must be a valid UUID"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

// Esquema para la creación de órdenes
export const createOrderSchema = z.object({
  products: z.array(orderProductSchema).min(1, "Order must have at least one product"),
}); 