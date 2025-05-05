import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  quantity: z.number().int().min(0, "Quantity must be a positive integer"),
  reference: z.string().min(1, "Reference is required"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  quantity: z.number().int().min(0, "Quantity must be a positive integer").optional(),
  reference: z.string().min(1).optional(),
});