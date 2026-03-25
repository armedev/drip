import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  gender: z.enum(["male", "female", "unisex"]),
  colour: z.string().min(1),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().int().positive(),
});

export const productQuerySchema = z.object({
  search: z.string().optional(),
  gender: z.string().optional(),
  colours: z.union([z.string(), z.array(z.string())]).optional(),
  types: z.union([z.string(), z.array(z.string())]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
